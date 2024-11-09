import os
from together import Together
from pydantic import BaseModel, Field

from dotenv import load_dotenv

load_dotenv()


class TestClass(BaseModel):
    title: str = Field(description="A title for the voice note")
    summary: str = Field(description="A short one sentence summary of the voice note.")
    actionItems: list[str] = Field(
        description="A list of action items from the voice note"
    )

    pass


client = Together(api_key=os.environ.get("TOGETHER_AI_KEY"))
transcript = (
    "Good morning! It's 7:00 AM, and I'm just waking up. Today is going to be a busy day, "
    "so let's get started. First, I need to make a quick breakfast. I think I'll have some "
    "scrambled eggs and toast with a cup of coffee. While I'm cooking, I'll also check my "
    "emails to see if there's anything urgent."
)
response = client.chat.completions.create(
    model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    messages=[
        {
            "role": "system",
            "content": "The following is a voice message transcript. Only answer in JSON.",
        },
        {
            "role": "user",
            "content": transcript,
        },
    ],
    response_format={"type": "json_object", "schema": TestClass.model_json_schema()},
)
print(response.choices[0].message.content)
