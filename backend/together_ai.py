import os
from together import Together
from pydantic import BaseModel, Field
from enum import StrEnum
import json

from dotenv import load_dotenv

load_dotenv()

class Status(StrEnum):
    pending = "pending"
    success =  "success"
    fail = "fail"

class BuildingBlock(BaseModel):
    name: str
    description: str    


class CheckIn(BaseModel):
    blocks: list[BuildingBlock] = Field(
        description="an actionable task the client should take by this check-in time"
    )

class Result(BaseModel):
    check_ins: list[CheckIn] = Field(description="check-ins")

client = Together(api_key=os.environ.get("TOGETHER_AI_KEY"))

f = open("../example_documents.txt")
response = client.chat.completions.create(
    model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    messages=[
        {
            "role": "system",
            "content": "The following is a set of instructions for patient care. Give me a list of all actionable tasks split into checkins. Give me it in json form.",
        },
        {
            "role": "user",
            "content": f.read(),
        },
    ],
    response_format={"type": "json_object", "schema": Result.model_json_schema()},
)
res = json.loads(response.choices[0].message.content)

print(json.dumps(res, indent=4))

for choice in response.choices:
    print(choice.message.content)
