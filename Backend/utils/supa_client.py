import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def add_user(user_id: str, user_data: dict):
    """
    Insert or update a user in the 'users_details' table using the provided user_id and user_data.
    """
    # Add the id field to user_data
    user_data['id'] = user_id


    # Upsert user record (insert or update)
    response = supabase.table('users_details').upsert(user_data).execute()
   
    return response
def search_user(user_id: str):
    response = supabase.table('users_details').select("*").eq("id", user_id).execute()
   
    return response
