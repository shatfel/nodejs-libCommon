/*
 * common nodejs lib 
 */
 

// libs
import chalk from 'chalk'
import * as fs from "fs"
import JSON5 from "json5"

// vars
// configure file 
let configFile = "./etc/config.json"
// config json
let jsonC = undefined


/*
 * class Printing
 */
class Printing {
  constructor(){
    this.message = {
      template: {
        dateUnit: { template: '[-date--:-unit--] ::> -prefix-- -message--' }, 
        dateUnitNumer: { template: '[-date--:-unit--:-number--] ::> -prefix-- -message--' }, 
        date: { template: '[-date--] ::> -prefix-- -message--' }
        }, 
      
      type: {
        normal: { prefix: '', color: "#fff" }, 
        error: { prefix: '/e/', color: "#f00" },
        info: { prefix: '/i/', color: "#989898" }, 
        debug: { prefix: '/d/', color: '#cfd1bc' }
        } 
      }
    }
  
  /*
   * @description print normal message
   * @param msg String
   */ 
  pP(msg) {
    let color = chalk.hex(this.message.type.normal.color)
    
    msg = (this.message.template.date.template).replace('-date--', new Date()).replace('-prefix--', this.message.type.normal.prefix).replace('-message--', msg)
    
    console.log(color(msg)) 
    }
  
  pE(msg) {
    let color = chalk.hex(this.message.type.error.color)
    
    msg = this.message.template.date.template.replace('-date--', new Date()).replace('-prefix--', this.message.type.error.prefix).replace('-message--', msg)
    
    console.log(color(msg))
  }
  
  setMessage(message) {
    this.message = message
    } 
  }


const pr = new Printing()

//
let res = fs.readFile(configFile, 'utf-8', (err, data) => {
  if (err) {
    pr.pE(`config file ${configFile} problem`)
    process.exit(1)
  }
  
  jsonC = JSON5.parse(data)
  
  if (jsonC.message !== undefined ) {
    pr.setMessage(jsonC.message)
    } 
  
  pr.pP(JSON5.stringify(jsonC)) 
  pr.pE(jsonC.message.template.dateUnitNumber.template)
})