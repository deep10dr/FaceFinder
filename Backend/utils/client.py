
import pinecone
import numpy as np
import uuid
import os
from dotenv import load_dotenv

load_dotenv()
# Pinecone client
pc = pinecone.Pinecone(api_key=os.getenv("PINECONE_APIKEY"))
index = pc.Index("face-embeddings")  

def upsert_embedding( embedding: list):
    """
    Inserts or updates an embedding with a given ID in Pinecone.
    """
    generate_id = str(uuid.uuid4())
    index.upsert(vectors=[{
        "id":generate_id,
        "values": embedding
    }])
   
    return generate_id

def search_embedding(embedding: list, top_k: int = 1):
    """
    Searches for similar embeddings in Pinecone and returns the top matches.
    """
    results = index.query(vector=embedding, top_k=top_k, include_values=False, include_metadata=False)
    return results
