'use strict'

const pick = (object, props)=>{


    let newObject = {};

    props.forEach(prop=>{
        
        if(object[prop]!==undefined)
        	newObject[prop] = object[prop];
        

        
    });

    return newObject;
};
//checks for empty obj,string,undefined,null


const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);


//Validates date
const isValidDate = date =>{
    if (Object.prototype.toString.call(date) === "[object Date]") {
        // it is a date
        if (isNaN(date.getTime())) {  
          // date is not valid
          return false;
        } 
        else {
          // date is valid
          return true;
        }
    } 
    else {
        // not a date
        return false;
    }
};


module.exports = {
    pick:pick,
    isEmpty:isEmpty,
    isValidDate:isValidDate
}