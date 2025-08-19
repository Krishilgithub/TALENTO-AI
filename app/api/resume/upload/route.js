import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
            return NextResponse.json({ error: "Supabase environment variables are not configured" }, { status: 500 });
        }

        // Get the authenticated user from cookies using anon client
        const cookieStore = await cookies();
        const authClient = createServerClient(supabaseUrl, anonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll() {
                    // no-op for API route
                },
            },
        });

        const { data: { user }, error: userError } = await authClient.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const extension = (file.name?.split(".").pop() || "").toLowerCase();
        const filePath = `resume/${user.id}/${Date.now()}.${extension || "bin"}`;

        // Use service role client to bypass RLS for storage and DB insert
        const serviceClient = createServerClient(supabaseUrl, serviceRoleKey, {
            cookies: {
                getAll() { return []; },
                setAll() { /* no-op */ },
            },
        });

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await serviceClient
            .storage
            .from("resume")
            .upload(filePath, fileBuffer, { upsert: true, contentType: file.type || "application/octet-stream" });

        if (uploadError) {
            return NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 });
        }

        const { data: publicUrlData } = serviceClient
            .storage
            .from("resume")
            .getPublicUrl(filePath);

        const { error: insertError } = await serviceClient
            .from("user_resume")
            .insert([
                {
                    user_id: user.id,
                    file_url: publicUrlData.publicUrl,
                    uploaded_at: new Date().toISOString(),
                    is_active: true,
                    analysis_output: null,
                },
            ]);

        if (insertError) {
            return NextResponse.json({ error: `Failed to save resume metadata: ${insertError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            url: publicUrlData.publicUrl,
            name: file.name,
            size: file.size,
            type: file.type,
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


