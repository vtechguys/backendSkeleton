const User = require('./User');
const config = require('../../../config');
const appConstants = config.constants;


const utils = require('../../../utils');
const validate = utils.validate;

class UserVendor extends User{
    constructor(userId, email){
        super(userId, email, "vendor");
    }

    static $createDbObj(obj){
        let dbObj;
        
        try{
            dbObj = super.$createDbObj(obj);
        }
        catch(exp){
            throw exp;
        }

        let isValidFname = false;

        if(validate.name(obj.firstName)){
            isValidFname = true;
        }
        if(!isValidFname){
            throw new Error(`firstName ${obj.firstName} is not valid.`);
        }

        let isValidLastName = false;
        if(validate.name(obj.lastName)){
            isValidLastName = true;
        }
        if(!isValidLastName){
            throw new Error(`lastName ${obj.lastName} is not valid.`);
        }
        dbObj["lastName"] = obj.lastName;

        let isValidCompanyName = false;
        if(validate.string(obj.companyName)){
            isValidCompanyName = true;
        }
        if(!isValidCompanyName){
            throw new Error(`lastName ${obj.lastName} is not valid.`);
        }
        dbObj["companyName"] = obj.companyName;

        let isValidMobileNo = false;
        if(validate.mobile(obj.mobile)){
            isValidMobileNo = true;
        }
        if(!isValidMobileNo){
            throw new Error(`mobile ${obj.mobile} is not valid.`)
        }
        dbObj["temporaryMobile"] = obj.mobile;
        dbObj["mobileVerified"] = false;

        let validRatings = false;
        obj.ratings = obj.ratings || appConstants.RATING_DEFAULT;
        if(typeof(obj.ratings)==="number" && obj.ratings>=0 && obj.ratings<= appConstants.RATING_DEFAULT){
            validRatings = true;
        }
        if(!validRatings){
            throw new Error(`ratings ${obj.ratings} is not valid.`);
        }
        dbObj["ratings"] = obj.ratings;


        let isValidOfficeAddress = false;
        if(obj.officeAddress){
            let a = obj.officeAddress.a;
            let isValidAddA = false;
            let area = obj.officeAddress.area;
            let isValidAddArea = false;
            let state = obj.officeAddress.state;
            let isValidAddState = false;
            let city = obj.officeAddress.city;
            let isValidAddCity = false;
            let country = obj.officeAddress.country;
            let isValidAddCntry = false;
            let pincode = obj.officeAddress.pincode;
            let isValidPincode = false;
            if(validate.string(a)){
                isValidAddA = true;
            }
            if(validate.string(area)){
                isValidAddArea = true;
            }
            if(validate.string(state)){
                isValidAddState = true;
            }
            if(validate.string(city)){
                isValidAddCity = true;
            }
            if(validate.string(country)){
                isValidAddCntry = true;
            }
            if(typeof(pincode)==="string" && pincode.length>=5 && pincode.length<=9){
                isValidPincode = true;
            }

            if(isValidAddA && isValidAddArea && isValidAddCity && isValidAddCntry && isValidAddState && isValidAddState && isValidPincode){
                isValidOfficeAddress = true;
            }

        }

        if(!isValidOfficeAddress){
            throw new Error(`officeAddress ${officeAddress} is not valid.`); 
        }
        dbObj["officeAddress"] = {
            'a': obj.officeAddress.a,
            'area': obj.officeAddress.area,
            'state': obj.officeAddress.state,
            'city': obj.officeAddress.city,
            'country': obj.officeAddress.country,
            'pincode': obj.officeAddress.pincode
        };



        let isValidResidenceAddress = false;
        if(obj.residenceAddress){
            let a = obj.residenceAddress.a;
            let isValidAddA = false;
            let area = obj.residenceAddress.area;
            let isValidAddArea = false;
            let state = obj.residenceAddress.state;
            let isValidAddState = false;
            let city = obj.residenceAddress.city;
            let isValidAddCity = false;
            let country = obj.residenceAddress.country;
            let isValidAddCntry = false;
            let pincode = obj.residenceAddress.pincode;
            let isValidPincode = false;
            if(validate.string(a)){
                isValidAddA = true;
            }
            if(validate.string(area)){
                isValidAddArea = true;
            }
            if(validate.string(state)){
                isValidAddState = true;
            }
            if(validate.string(city)){
                isValidAddCity = true;
            }
            if(validate.string(country)){
                isValidAddCntry = true;
            }
            if(typeof(pincode)==="string" && pincode.length>=5 && pincode.length<=9){
                isValidPincode = true;
            }

            if(isValidAddA && isValidAddArea && isValidAddCity && isValidAddCntry && isValidAddState && isValidAddState && isValidPincode){
                isValidResidenceAddress = true;
            }

        }

        if(!isValidResidenceAddress){
            throw new Error(`residenceAddress ${residenceAddress} is not valid.`); 
        }
        dbObj["residenceAddress"] = {
            'a': obj.residenceAddress.a,
            'area': obj.residenceAddress.area,
            'state': obj.residenceAddress.state,
            'city': obj.residenceAddress.city,
            'country': obj.residenceAddress.country,
            'pincode': obj.residenceAddress.pincode
        };



        return dbObj;
    }
}
module.exports = UserVendor;