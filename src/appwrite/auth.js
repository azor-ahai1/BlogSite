import conf from "../conf/conf";
import {Client, Account, ID} from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if(userAccount){
                return this.login({email, password});
            }
            else{
                return userAccount;
            }
        } catch(error){
            throw error;
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
}

const authService = new AuthService ();

export default authService