import os
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import TypedDict, Literal
from pydantic import BaseModel
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Hugging Face API key
hf_api_key = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP")

# Initialize model with fallback
model = None
if hf_api_key:
    try:
        # Initialize Hugging Face Endpoint for conversational task
        llm = HuggingFaceEndpoint(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            huggingfacehub_api_token=hf_api_key,
            temperature=0.7,
            max_new_tokens=1000,
        )
        model = ChatHuggingFace(llm=llm)
    except Exception as e:
        print(f"Warning: Failed to initialize Hugging Face Endpoint: {str(e)}")
        model = None
else:
    print("Warning: HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found. Using fallback mode.")

# Output parser
parser = StrOutputParser()

# Prompt template for LinkedIn post generation
linkedin_post_template = """
You are an expert LinkedIn content creator. Generate a professional LinkedIn post based on the user's description.

Post Type: {post_type}
Topic: {topic}
User Description: {post_description}

Requirements:
1. Make it engaging and professional based on the user's description
2. Include relevant hashtags (3-5 hashtags)
3. Add a call-to-action
4. Keep it under 1300 characters
5. Use bullet points or emojis where appropriate
6. Follow the user's description and style preferences
7. Make it authentic and shareable

Format the post as:
[Post content with proper formatting]

Hashtags: #[relevant hashtag] #[relevant hashtag] #[relevant hashtag]

Make it valuable and engaging based on the user's specific requirements.
"""

linkedin_post_prompt = PromptTemplate(
    input_variables=["post_type", "topic", "post_description"],
    template=linkedin_post_template
)

# Create RunnableSequence only if model is available
linkedin_post_chain = None
if model:
    linkedin_post_chain = RunnableSequence(linkedin_post_prompt | model | parser)

def generate_linkedin_post(post_type: str = "Professional Insight", topic: str = "Career Development", post_description: str = "Share insights about career growth and professional development") -> dict:
    try:
        if linkedin_post_chain:
            result = linkedin_post_chain.invoke({
                "post_type": post_type, 
                "topic": topic,
                "post_description": post_description
            })
            return {
                "post": result,
                "post_type": post_type,
                "topic": topic,
                "post_description": post_description,
                "status": "success"
            }
        else:
            # Fallback response with sample posts
            fallback_posts = {
                "Career Development": {
                    "post": """🚀 **Career Growth Tip**

Just wrapped up an amazing project that taught me a valuable lesson: **continuous learning is non-negotiable** in tech.

Here's what I learned:
• Always stay curious about new technologies
• Build side projects to expand your skills
• Network with other professionals
• Share your knowledge with the community

The professional landscape evolves rapidly, and the best professionals are those who adapt and grow continuously.

What's your approach to staying current in your field?

#CareerGrowth #ProfessionalDevelopment #ContinuousLearning #Networking #SkillDevelopment""",
                    "hashtags": ["#CareerGrowth", "#ProfessionalDevelopment", "#ContinuousLearning", "#Networking", "#SkillDevelopment"]
                },
                "Industry Trends": {
                    "post": """📊 **Latest Industry Trends**

The industry is moving at lightning speed! Here are the key trends I'm seeing:

🔥 **AI/ML Integration**: Every company wants AI capabilities
🌐 **Cloud-Native Development**: Kubernetes and microservices are everywhere
🔒 **Security-First Approach**: DevSecOps is becoming standard
⚡ **Low-Code/No-Code**: Empowering non-developers to build solutions

Staying ahead means embracing these changes while maintaining core fundamentals.

What trends are you most excited about?

#IndustryTrends #Innovation #Technology #FutureOfWork #DigitalTransformation""",
                    "hashtags": ["#IndustryTrends", "#Innovation", "#Technology", "#FutureOfWork", "#DigitalTransformation"]
                },
                "Professional Achievement": {
                    "post": """🎉 **Excited to Share a Major Milestone!**

Just completed a challenging project that pushed my limits and expanded my skills significantly.

**What we accomplished:**
✅ Delivered a scalable architecture
✅ Reduced system response time by 60%
✅ Implemented comprehensive testing strategy
✅ Mentored team members

The best part? Working with an incredible team that made every challenge feel like an opportunity to grow.

Grateful for the learning experience and excited for what's next!

#ProfessionalAchievement #ProjectSuccess #TeamWork #Growth #Milestone""",
                    "hashtags": ["#ProfessionalAchievement", "#ProjectSuccess", "#TeamWork", "#Growth", "#Milestone"]
                }
            }
            
            # Get the appropriate fallback post based on topic
            fallback_post = fallback_posts.get(topic, fallback_posts["Career Development"])
            
            return {
                "post": fallback_post["post"],
                "hashtags": fallback_post["hashtags"],
                "post_type": post_type,
                "topic": topic,
                "post_description": post_description,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating LinkedIn post: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_linkedin_post("Professional Insight", "Career Development", "Share insights about career growth and professional development")
    print(result) 