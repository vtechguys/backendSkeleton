const User = require('./User');
const config = require('../../../config');
const logger = config.logger;
const utils = require('../../../utils');
const validate = utils.validate;

class UserDriver extends User{
    constructor(){
        super("driver");
    }
    static $createDbObj(obj){
        let dbObj;
        try{
            dbObj = super.$createDbObjBase(obj);
        }
        catch(exp){
            throw exp;
        }
        document = {
            adhar:{
                no: "4040404040404040",
                link:"https://aws.vagaari.com/drivers/adhar"
            },
            pancard:{
                no: "ECPJ125J9",
                link: "https://aws.vagaari.com/drivers/pancard"
            },
            drivingLisence:{
                no: "ECPJ125J9",
                link: "https://aws.vagaari.com/drivers/pancard",
                expiryDate: "hjhj"
            },
            otherDocuments:[{
                type: "residence",
                link: "https://aws.vagaari.com/drivers/other-documents"
            }]
        };

        if(!validate.name(obj.firstName)){
            throw new Error(`firstName ${obj.firstName} is not valid.`);
        }
        dbObj["firstName"] = obj.firstName;

        if(!validate.name(obj.lastName)){
            throw new Error(`lastName ${obj.lastName} is not valid.`);
        }
        dbObj["lastName"] = obj.lastName;

        if(!validate.email(obj.email)){
            throw new Error(`email ${obj.email} is not valid`);
        }
        dbObj["email"] = obj.email;
        if(!validate.mobile(obj.mobile)){
            throw new Error(`mobile ${obj.mobile} is not valid.`);
        }
        dbObj["mobile"] = obj.mobile;
        if(!obj.dob){
            throw new Error(`dob ${obj.dob} is not valid`);
        }
        dbObj["dob"] = obj.dob;


        
        // let documents = obj.documents;
        // let isValidDocuments = false;
        // if(documents && (typeof(documents)==="object")){
        //     dbObj["documents"] = {};

        //     let adhar = documents.adharCard;
        //     let isValidAdharCard = false;
        //     let pan = documents.panCard;
        //     let isValidPanCard = false;

        //     if( (adhar && typeof(adhar) === "object") || (pan && typeof(pan) === "object") ){
        //         if(adhar){
        //             let isValidAdharCardNo = false;
        //             if(adhar.no && validate.adharNo(adhar.no)){
        //                 dbObj.documents["adhar"] = {};
        //                 dbObj.documents.adhar["no"] = adhar.no;
        //                 isValidAdharCardNo = true;
        //             }
        //             let isValidAdharCardLink = false;
        //             if(adhar.link && (typeof(adhar.link)==="string") ){

        //             }
        //         }
        //         else{

        //         }
        //     }
        // }

        
    }
}
module.exports = UserDriver;