import conf from "../conf/conf";
import {Client, Account, ID, Databases, Storage, Query} from "appwrite";


export class AuthService {
    client = new Client();
    account;
    databases;
    bucket;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client); 
    }

    async createAccount({email, password, name, username}){
        try{
            const tempUserId = ID.unique();
            const storeData = await this.storeUserData({ userId: tempUserId, username, email, password, name,});

            if(!storeData){
                throw new Error("Username storage failed. Account creation aborted.");
            }

            const userAccount = await this.account.create(tempUserId, email, password, name,);
            if(userAccount){
                try{ 
                    return await this.login({email, password});
                } catch(error){
                    throw error;
                }
            }  else {
                return userAccount;
            }
        } catch(error){
            throw error;
        }
    }

    async storeUserData({ userId, username, email, name }) {
        try {
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserDataId,
                userId,
                { userId, username, email, name }
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
            // throw error; 
        }
    }

    async getUserData(userId) {
        // console.log("Fetching user data for ID:", userId);
        try {
            const userData = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserDataId,
                userId 
            );
            // console.log("Fetched user data:", userData);
            return userData; 
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    async getUserDataByUsername(username) {
        try {
            const userData = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserDataId,
                [Query.equal("username", username)] 
            );
    
            if (userData.documents.length === 1) { 
                return userData.documents[0]; 
            } else {
                console.error("No user found with the given username.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data by username:", error);
            return null;
        }
    }

    async getUsers(queries = []){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserDataId,
                queries
            )
        } catch(error){
            console.log("Appwrite service :: getUsers :: error", error);
            return false;
        }
    }
    
    async updateUserData(userId, {username, profilePic, userQuote}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserDataId,
                userId,
                {
                    userId,
                    profilePic,
                    userQuote,
                }
            ) 
        }   catch(error){
                console.log("Appwrite service :: updateUserData :: error", error);
        }
    }




    async login({email, password}){
        try{
            // return await this.account.createEmailSession(email, password);
            return await this.account.createEmailPasswordSession(email,password);
        } catch(error){
            console.log("Login Error:", error.message)
            throw error;
        }
    }

    async getCurrentUser(){
        try{
            return await this.account.get();
        } catch(error){
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        // for fail-safe is we didn't get any returns 
        return null;        
    }


    // Chat-GPT
    // async getCurrentUser(){
    //     try{
    //         const session = await this.account.getSession("current"); // Check if a session exists
    //         if (session) {
    //             return await this.account.get(); // Only fetch the user if a session exists
    //         }
    //     } catch(error){
    //         console.log("Appwrite service :: getCurrentUser :: error", error);
    //     }
    
    //     // Return null if no session or error occurs
    //     return null;        
    // }

    async logout(){
        try{
            // for deleting login of this account from this browser only
            // await this.account.deleteSession();

            // for deleting all logins of this account from any browser
            await this.account.deleteSessions();
        } catch(error){
            console.log("Appwrite service :: logout :: error", error);
        }
    }

    async uploadFile(file){
        try{
            const uploadedFile = await this.bucket.createFile(
                conf.appwriteUserPicId,
                ID.unique(),
                file
            );
            return uploadedFile;
        } catch(error){
            console.log("Appwrite service :: uploadUserPic :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteUserPicId,
                fileId
            )
            return true;
        } catch(error){
            console.log("Appwrite service :: deleteUserPic :: error", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteUserPicId,
            fileId
        )        
    }
}

const authService = new AuthService ();

export default authService

