import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    // Check if required variables are set
    const configStatus = {
      supabase: {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        key: supabaseKey ? '✅ Set' : '❌ Missing',
        valid: !!(supabaseUrl && supabaseKey)
      },
      site: {
        url: siteUrl ? '✅ Set' : '⚠️ Not set (optional)',
        valid: true
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        isProduction: process.env.NODE_ENV === 'production'
      }
    };

    // Check if Supabase URL is valid
    if (supabaseUrl) {
      try {
        const url = new URL(supabaseUrl);
        configStatus.supabase.validUrl = url.protocol === 'https:' ? '✅ Valid HTTPS' : '⚠️ Not HTTPS';
      } catch {
        configStatus.supabase.validUrl = '❌ Invalid URL format';
        configStatus.supabase.valid = false;
      }
    }

    // Check if Supabase key looks valid (JWT format)
    if (supabaseKey) {
      const keyParts = supabaseKey.split('.');
      configStatus.supabase.validKey = keyParts.length === 3 ? '✅ Valid JWT format' : '❌ Invalid format';
      if (keyParts.length !== 3) {
        configStatus.supabase.valid = false;
      }
    }

    return NextResponse.json({
      success: true,
      config: configStatus,
      recommendations: getRecommendations(configStatus)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

function getRecommendations(configStatus) {
  const recommendations = [];
  
  if (!configStatus.supabase.valid) {
    recommendations.push('Fix Supabase configuration - check URL and API key');
  }
  
  if (configStatus.environment.isProduction && !configStatus.site.url) {
    recommendations.push('Set NEXT_PUBLIC_SITE_URL for production environment');
  }
  
  if (configStatus.supabase.valid) {
    recommendations.push('Check Supabase dashboard for OAuth provider configuration');
    recommendations.push('Verify redirect URLs in Supabase Authentication settings');
  }
  
  return recommendations;
}
