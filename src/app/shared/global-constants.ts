export class GlobalConstants {

    //messge
    public static genericError: string = "Something Went Wrong. Try Again later.";

    public static reservationError: string = "Table Already Reserverd";

    public static unauthorized: string = "You are not authorized for access.";

    public static productExistError:string="Product Already Exist";

    public static productAdded:string="Product Added Successfully";

    
    
    //regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex: string = "^[0-9]{11,11}$";

    public static phoneNumberRegex: string = "^[0-9]{11,11}$";
    public static customerContactRegex:string = "^[0-9]{11,11}$";

    //variable

    public static error: string = "error";



}