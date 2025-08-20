import os
import requests
from typing import Optional, Dict, Any
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from llm_provider import get_chat_model

load_dotenv()

# Initialize model using OpenRouter
model = get_chat_model()

# LinkedIn API Configuration
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:3000/auth/linkedin/callback")

def get_linkedin_auth_url():
    """Generate LinkedIn OAuth authorization URL"""
    if not LINKEDIN_CLIENT_ID:
        return {"error": "LinkedIn Client ID not configured"}
    
    auth_url = (
        f"https://www.linkedin.com/oauth/v2/authorization?"
        f"response_type=code&"
        f"client_id={LINKEDIN_CLIENT_ID}&"
        f"redirect_uri={LINKEDIN_REDIRECT_URI}&"
        f"scope=r_liteprofile%20w_member_social&"
        f"state=random_state_string"
    )
    return {"auth_url": auth_url}

def exchange_code_for_token(authorization_code: str) -> Dict[str, Any]:
    """Exchange authorization code for access token"""
    if not LINKEDIN_CLIENT_ID or not LINKEDIN_CLIENT_SECRET:
        return {"error": "LinkedIn credentials not configured"}
    
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": authorization_code,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
        "redirect_uri": LINKEDIN_REDIRECT_URI
    }
    
    try:
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to exchange code for token: {str(e)}"}

def get_user_profile(access_token: str) -> Dict[str, Any]:
    """Get user's LinkedIn profile information"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(
            "https://api.linkedin.com/v2/me",
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to get profile: {str(e)}"}

def post_to_linkedin(access_token: str, post_content: str) -> Dict[str, Any]:
    """Post content directly to LinkedIn"""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    # Get user's profile ID first
    profile_response = get_user_profile(access_token)
    if "error" in profile_response:
        return profile_response
    
    profile_id = profile_response.get("id")
    
    # Create the post
    post_data = {
        "author": f"urn:li:person:{profile_id}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": post_content
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }
    
    try:
        response = requests.post(
            "https://api.linkedin.com/v2/ugcPosts",
            headers=headers,
            json=post_data
        )
        response.raise_for_status()
        return {"success": True, "post_id": response.json().get("id")}
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to post to LinkedIn: {str(e)}"}

def generate_linkedin_post(
    post_type: str = "Professional Insight",
    topic: str = "Career Development", 
    post_description: str = "Share insights about career growth and professional development"
) -> Dict[str, Any]:
    """
    Generate a LinkedIn post using AI
    """
    print(f"🔄 Generating LinkedIn post: {post_type} about {topic}")
    
    try:
        if model:
            # Use OpenRouter AI model to generate post
            prompt_template = PromptTemplate(
                input_variables=["post_type", "topic", "post_description"],
                template="""
                You are a LinkedIn content expert specializing in creating viral, engaging professional posts. Create a compelling LinkedIn post with the following specifications:

                POST TYPE: {post_type}
                TOPIC: {topic}
                CONTEXT: {post_description}

                CONTENT GUIDELINES:
                🎯 HOOK: Start with an attention-grabbing opening line that makes people want to read more
                📖 STORY: Include a brief personal anecdote, industry insight, or thought-provoking question
                💡 VALUE: Provide actionable advice, key insights, or valuable takeaways
                🤝 ENGAGEMENT: End with a compelling call-to-action that encourages comments and shares
                
                FORMATTING REQUIREMENTS:
                • Use emojis strategically for visual appeal (2-4 total)
                • Include 3-5 relevant hashtags at the end
                • Keep under 1300 characters
                • Use short paragraphs (2-3 lines max)
                • Add line breaks for readability
                • Include numbers or bullets for key points

                TONE & STYLE:
                ✅ Professional yet conversational
                ✅ Authentic and relatable  
                ✅ Actionable and valuable
                ✅ Optimized for LinkedIn algorithm
                ✅ Encourages engagement

                Create a post that would get high engagement (likes, comments, shares) on LinkedIn:
                """
            )
            
            try:
                prompt = prompt_template.format(
                    post_type=post_type,
                    topic=topic,
                    post_description=post_description
                )
                result = model.invoke(prompt)
                
                print("✅ AI LinkedIn post generated successfully!")
                
                return {
                    "post_content": result.content,
                    "source": "openrouter_ai",
                    "post_type": post_type,
                    "topic": topic,
                    "status": "success"
                }
            except Exception as ai_error:
                print(f"❌ AI generation failed: {ai_error}")
                print("🔄 Falling back to template post...")
        else:
            print("⚠️ No model available, using template post...")
        
        # Enhanced fallback template posts
        fallback_posts = {
            "Professional Insight": f"""� Here's what nobody tells you about {topic}...

{post_description}

After years in the industry, I've learned that success isn't just about what you know—it's about how you apply it.

💡 3 game-changing strategies:
→ Master the fundamentals, then innovate
→ Build relationships before you need them  
→ Document your wins (and failures)

The professionals who thrive don't just work harder—they work smarter.

#ProfessionalGrowth #CareerStrategy #LinkedInTips #SuccessMindset #ProfessionalDevelopment

What's the best professional advice you've ever received? 👇""",
                
            "Industry Update": f"""� {topic}: The landscape is shifting faster than ever

{post_description}

What I'm seeing in the market right now:

📈 Rising trends:
• Automation reshaping workflows
• Remote-first becoming the norm
• Sustainability driving innovation
• AI augmenting human creativity

⚠️ What this means for you:
The skills that got you here won't get you there. Continuous learning isn't optional—it's survival.

#IndustryInsights #{topic.replace(' ', '')} #FutureOfWork #MarketTrends #Innovation

How is your industry evolving? Share your insights below �""",
                
            "Career Advice": f"""� The uncomfortable truth about {topic}

{post_description}

Early in my career, I thought success meant saying yes to everything. I was wrong.

🎯 What actually moves the needle:
• Say no to good opportunities to make room for great ones
• Invest in relationships over transactions  
• Focus on outcomes, not just outputs
• Learn to communicate your value clearly

Your career isn't a sprint—it's a strategic game of chess.

#CareerTips #ProfessionalSuccess #CareerStrategy #LeadershipLessons #WorkWisdom

What's one career mistake you wish you could undo? Let's learn together 👇""",
                
            "Networking": f"""🤝 Stop "networking"—start building genuine relationships

{post_description}

The best opportunities come from people who know, like, and trust you.

🌟 My relationship-building playbook:
→ Give value before asking for anything
→ Remember personal details (birthdays, challenges, wins)
→ Follow up consistently, not just when you need something
→ Celebrate others' successes publicly

Authentic connections > transactional exchanges. Every. Single. Time.

#Networking #RelationshipBuilding #ProfessionalConnections #CommunityBuilding #AuthenticLeadership

Tag someone who's been instrumental in your professional journey 🙌"""
            }
            
        post_type_key = post_type if post_type in fallback_posts else "Professional Insight"
        return {"post_content": fallback_posts[post_type_key], "source": "template", "status": "fallback"}
            
    except Exception as e:
        return {"error": f"Error generating LinkedIn post: {str(e)}"}

def generate_and_post_to_linkedin(
    access_token: str,
    post_type: str = "Professional Insight",
    topic: str = "Career Development",
    post_description: str = "Share insights about career growth and professional development"
) -> Dict[str, Any]:
    """
    Generate a LinkedIn post and post it directly to the user's profile
    """
    # First generate the post content
    post_result = generate_linkedin_post(post_type, topic, post_description)
    
    if "error" in post_result:
        return post_result
    
    post_content = post_result["post_content"]
    
    # Then post it to LinkedIn
    post_result = post_to_linkedin(access_token, post_content)
    
    if "error" in post_result:
        return post_result
    
    return {
        "success": True,
        "post_content": post_content,
        "post_id": post_result.get("post_id"),
        "message": "Post successfully published to LinkedIn!"
    } 