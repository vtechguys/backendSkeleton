const User = require('../schema/User');
const UserSuperAdmin = require('../class/User/UserSuperAdmin');


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
                logger.debug('createsuperadmin user.findOneSA ', result);
                if(!result){
                    let userId = generate.randomString(appConstants.USER_ID_LENGTH);
                    let superAdminObj = new UserSuperAdmin(userId, config.SUPER_ADMIN_EMAIL);
                    superAdminObj['password'] = 'superadmin';
                    superAdminObj.$setEmailVerified(false);
                    console.log({ ...superAdminObj});
                    let saDbObj = new User({ ...superAdminObj});
                    saDbObj.save(superAdminObj, (error1, result1)=>{
                        if(error1){
                            logger.error(`createsuperadmin user.create, ${error1}`);
                            console.log(error1)
                            callback(error1);
                        }
                        else{
                            callback(null, result1);
                        }
                    })
                }
                else{
                    callback(null, result);
                }
            }
        })
    }
};
module.exports = dbOperations;