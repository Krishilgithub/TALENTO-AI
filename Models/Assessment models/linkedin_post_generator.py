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
                Create a professional LinkedIn post based on the following requirements:
                
                Post Type: {post_type}
                Topic: {topic}
                Description: {post_description}
                
                Requirements:
                - Make it engaging and professional
                - Include relevant hashtags
                - Keep it under 1300 characters
                - Add a call-to-action
                - Use proper LinkedIn formatting
                
                Generate the post:
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
        
        # Fallback template post
        fallback_posts = {
            "Professional Insight": f"""🚀 {topic}: {post_description}

💡 Key insights to consider:
• Stay updated with industry trends
• Network actively with professionals
• Continuously develop your skills
• Share your knowledge with others

#ProfessionalDevelopment #CareerGrowth #Networking #SkillsDevelopment #LinkedInLearning

What's your biggest career lesson learned? Share below! 👇""",
                
                "Industry Update": f"""📊 {topic} Update: {post_description}

🔍 What's happening:
• Industry trends and developments
• New technologies emerging
• Market shifts and opportunities
• Future predictions

#IndustryUpdate #MarketTrends #Technology #Innovation #ProfessionalInsights

How is this affecting your industry? Let's discuss! 💬""",
                
                "Career Advice": f"""💼 {topic}: {post_description}

🎯 Pro tips for success:
• Set clear career goals
• Build a strong personal brand
• Develop transferable skills
• Maintain work-life balance
• Stay curious and keep learning

#CareerAdvice #ProfessionalGrowth #PersonalBrand #WorkLifeBalance #ContinuousLearning

What career advice would you give to someone starting out? 🤔""",
                
                "Networking": f"""🤝 {topic}: {post_description}

🌟 Building meaningful connections:
• Attend industry events
• Engage on professional platforms
• Offer value to others
• Follow up consistently
• Be authentic in interactions

#Networking #ProfessionalConnections #RelationshipBuilding #CareerNetworking #AuthenticConnections

Who has been your most valuable professional connection? Tag them below! 👇"""
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
    
    post_content = post_result["post"]
    
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