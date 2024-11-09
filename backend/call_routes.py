from flask import Blueprint
from vapi import Vapi
import os
from dotenv import load_dotenv

load_dotenv()

routes = Blueprint("call_routes", __name__)

vapi_client = Vapi(
    token=os.environ["VAPI_API_KEY"],
)


@routes.get("/")
def call():
    res = vapi_client.calls.create(
        assistant_id=os.environ["VAPI_ASSISTANT_ID"],
        phone_number_id=os.environ["VAPI_PHONE_NUMBER_ID"],
        customer={"number": "+1(650)305-1830"},
    )
    return res.json()
