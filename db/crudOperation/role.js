//models
const User = require('../schema/User');
const Role = require('../schema/Role');
// Classess
const UserSuperAdmin = require('../class/User/UserSuperAdmin');
const RoleClass = require('../class/Role/Role');
// config,logger,constants
const config = require('../../config');
const logger = config.logger;
const appConstants = config.constants;

const dbOperations = {
    createSuperAdmin(callback){
        logger.debug('ROLE_CRUD createsuperadmin');
        const utils = require('../../utils');
        const generate = utils.generate;
        let findUserRoleSA = {
            'role': 'superadmin'
        };
        let userProjectFields = {
            _id: 1,
            userId: 1
        };
        User
        .findOne(findUserRoleSA, userProjectFields)
        .exec((error, result)=>{
            if(error){
                logger.error(`createsuperadmin user.findOne ${error}`);
                callback(error, null);
            }
            else{
                if(!result){
                    let userId = generate.randomString(appConstants.USER_ID_LENGTH);

                    let superAdminObj = new UserSuperAdmin(userId, config.SUPER_ADMIN_EMAIL);
                    superAdminObj.encryptPassword("a".repeat(32));
                    superAdminObj.$setEmailVerified(false);
                    superAdminObj.$setFirstName('superadmin');
                    superAdminObj.$setLastName('superadmin');
                    superAdminObj.$setPhoneNo(config.MOBILE_NO);

                    let dbObj;
                    try{
                        dbObj = UserSuperAdmin.$createDbObj(superAdminObj);
                        User.create(dbObj, (error1, result1)=>{
                            if(error1){
                                logger.error(`createsuperadmin user.create, ${error1}`);
                                console.log(error1)
                                callback(error1);
                            }
                            else{
                                callback(null, result1);
                            }
                        });
                    }
                    catch(exp){
                        logger.error(`superAdmin createDbObj error format ${exp}`);
                        console.log(`superAdmin createDbObj error format`,exp);
                    }
                    
                }
                else{
                    callback(null, result);
                }
            }
        })
    },
    getRole(role, callback){
        logger.debug(`getRole ${role}`);
        Role
        .findOne({
            "role": role
        })
        .exec((error, result)=>{
            if(error){
                logger.error(`getRole ${role}::::${error}`);
                callback(error, null);
            }
            else{
                callback(null, result);
            }
        });
    },
    fillRights(roleId, rights, callback){
        logger.debug('roleCRUD fillRights');
        Role
        .findOneAndUpdate({
            "roleId": roleId
        },{
            "$set":{
                "rights": rights
            }
        })
        .exec((error, result)=>{
            if(error){
                logger.error(`fillRights ${error}`);
                console.log(error)
                callback(error);
            }
            else{
                callback(null, result);
            }
        })
    },
    createRole(role, callback){
        logger.debug('roleCRUD createRole');
        const utils = require('../../utils');
        const generate = utils.generate;

        let roleId = generate.randomString(appConstants.ROLE_ID_LENGTH);
        const RoleObj = new RoleClass(roleId);
        RoleObj.$setRole(role);

        Role.create(RoleObj, (error, result)=>{
            if(error){
                logger.error(`createRole ${error}`);
                console.log("ceateRole",error);
                callback(error);
            }
            else{
                callback(null, result);
            }
        });


    }
};
module.exports = dbOperations;