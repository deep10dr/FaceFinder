from fastapi import FastAPI,Form,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model.face_model import generate_facenet512_embedding,base64_to_cv2_image
from utils.client import upsert_embedding,search_embedding
from utils.supa_client import add_user,search_user
from model.face_match import face_match
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    image: str

@app.post("/user")
async def upload_image(data: ImageData):   
    try:
        embedding = generate_facenet512_embedding(data.image)
    
        result = search_embedding(embedding)
      
        id = result["matches"][0]["id"]
        
        response = search_user(id)
       
        img1 = base64_to_cv2_image(data.image)
        img2 = base64_to_cv2_image(response.data[0]['captured_image'])
        final = face_match(img1,img2)
        if(final):
            return {
            "message": "Embedding generated successfully",
            "embedding": response
        }
        else:
            raise HTTPException(status_code=400, detail="Face not founf Proprly")

        
    except Exception as e:
        return {"error": str(e)}
@app.post("/new_user")
async def new_user(
    username: str = Form(...),
    age: int = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    email: str = Form(...),
    gender: str = Form(...),
    image: str = Form(...)  # base64 string from frontend
):
    try:
        # Generate embedding and ID
        embedding = generate_facenet512_embedding(image)
        result = search_embedding(embedding)
        id = result["matches"][0]["id"]
        
        res = search_user(id)
        img1 = base64_to_cv2_image(image)
        img2 = base64_to_cv2_image(res.data[0]['captured_image'])
        final = face_match(img1,img2)
        print(final)

        if final:
            raise HTTPException(status_code=400, detail="User already exists")


        id = upsert_embedding(embedding)

        user_data = {
            "username": username,
            "age": age,
            "phone": phone,
            "address": address,
            "email": email,
            "gender": gender,
            "captured_image": image
        }

        # Add user to Supabase
        response = add_user(id, user_data)


        return {
            "success": True,
            "message": "User added",
            "id": id 
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
