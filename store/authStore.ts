import { API_URL } from "@/constants/api"
import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useAuthStore = create((set)=> ({

    user: null,
    token: null,
    isLoading:false,
    ischeckingAuth:true,

    register: async (username: string, email: string, password: string)=>{
        set({isLoading:true})
        try{
            const resposne = await fetch(`${API_URL}/auth/register`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data = await resposne.json()
            
            if(!resposne.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token)

            set({token: data.token, user:data.user, isLoading:false});

            return {success: true, message: "User registered successfully"}

        }catch(error: any){
            console.log(error)
            return {success: false, message: error.message}
        }
    },

    checkAuth: async () =>{
        try{
            const userJson = await AsyncStorage.getItem("token");
            const token = await AsyncStorage.getItem("user");
           
            const user = userJson ? JSON.parse(userJson) : null;
            //const tokenn = token ? JSON.parse(token) : null;
            set({user, token});

        }catch(error:any){
            console.log(error)

        }finally{
            set({ischeckingAuth:false})
        }
    }

}))