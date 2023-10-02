/*
 * common nodejs lib 
 */
 

/*
 * libs
 */
import chalk from 'chalk'
import { unsubscribe } from 'diagnostics_channel'
import * as fs from "fs"
import JSON5 from "json5"
import { inspect } from 'util'

/**
 * vars
 */
// configure file 
let configFile = "./etc/config.json"



/**
 * Printing class
 */
class Printing {
  /**
   * 
   * @param {boolean} debug true(def) | false
   */
  constructor(debug=true){
    this.debug = debug
    this.message = {
      template: {
        default: "dateOnly",

        dateUnit: { template: '[-date--:-unit--] ::> -prefix-- -message--' }, 
        dateUnitNumber: { template: '[-date--:-unit--:-number--] ::> -prefix-- -message--' }, 
        dateOnly: { template: '[-date--] ::> -prefix-- -message--' }
        }, 
      
      type: {
        default: { prefix: "", fg: "", bg: "" },

        white: { prefix: '', fg: "#fff", bg: "#000000" }, 
        error: { prefix: '/e/', fg: "#ff0000", bg: "#000000" },
        info: { prefix: '/i/', fg: "#989898", bg: "#000000" }, 
        debug: { prefix: '/d/', fg: '#cfd1bc', bg: "#000000" }
        } 
      }
    }
  
  /**
   * @description print message depend on type and template
   * @param {Object} msg message JSON
   * @param {string} msg.msg - message
   * @param {string} msg.type - type
   * @param {string} msg.template - template
   * @param {string} msg.unit - unit
   * @param {string} msg.number - number
   */
  pP(msg) {
    let template = undefined
    let color = undefined

    // check type
    switch (msg.type) {
      case "white":
        color = chalk.hex(this.message.type.white.fg).bgHex(this.message.type.white.bg)
        break
      case "error":
        color = chalk.hex(this.message.type.error.fg).bgHex(this.message.type.error.bg)
        break
      case "info":
        color = chalk.hex(this.message.type.info.fg).bgHex(this.message.type.info.bg)
        break
      case "debug":
        color = chalk.hex(this.message.type.debug.fg).bgHex(this.message.type.debug.bg)
        break
      default:
        msg.type = "default"
        color = chalk.reset
    }

    
    // check template
    switch (msg.template) {
      case "default":
      case "dateOnly":
        template = this.message.template[this.message.template.default]
        break
      case "dateUnit":
        template = this.message.template.dateUnit
        if (msg.unit === undefined) msg.unit = ""
        break
      case "dateUnitNumber":
        template = this.message.template.dateUnitNumber
        if (msg.unit === undefined) msg.unit = ""
        if (msg.number === undefined) msg.number = ""
        break
      default:
        template = this.message.template[this.message.template.default]
    }

    // get date
    let currDate = new Date()
    currDate = currDate.toISOString().replace('T', ' ').replace(/\.[0-9]+Z$/, '')

    // prepare message
    let _msg = template.template
            .replace('-date--', currDate)
            .replace('-prefix--', this.message.type[msg.type].prefix)
            .replace('-unit--', msg.unit)
            .replace('-number--', msg.number)
            .replace('-message--', msg.msg)
    
    // print message
    if (msg.type != "error" ) {
      console.log(color(_msg))
      }
    else {
      console.error(color(_msg))
    }
    }
  
  
  /**
   * @description print error message
   * @param {Object} msg message JSON
   * @param {string} msg.msg - message
   * @param {string} msg.template - template
   * @param {string} msg.unit - unit
   * @param {string} msg.number - number
   */
  pE(msg) {
    msg.type = "error"
    
    if (msg.template === undefined ) msg.template = "default"

    this.pP(msg)
  }
  

  /**
   * @description print info message
   * @param {Object} msg message JSON
   * @param {string} msg.msg - message
   * @param {string} msg.template - template
   * @param {string} msg.unit - unit
   * @param {string} msg.number - number
   */
  pI(msg) {
    msg.type = "info"
    
    if (msg.template === undefined ) msg.template = "default"

    this.pP(msg)
  }


  /**
   * @description print debug message
   * @param {Object} msg message JSON
   * @param {string} msg.msg - message
   * @param {string} msg.template - template
   * @param {string} msg.unit - unit
   * @param {string} msg.number - number
   */
  pD(msg) {
    if (this.debug === true ) {
      msg.type = "debug"
      
      if (msg.template === undefined ) msg.template = "default"

      this.pP(msg)
      }
  }


  setdDebug(debug) {
    this.debug = debug
    }

  setMessage(message) {
    this.message = message
    }
    
  getMessage() {
    return this.message
    }
  }


const pr = new Printing()

//
let res = fs.readFile(configFile, 'utf-8', (err, data) => {
  if (err) {
    pr.pE(`config file ${configFile} problem`)
    process.exit(1)
  }
  
  // config json
  let jsonC = JSON5.parse(data)
  
  pr.setdDebug(jsonC.debug)
  if (jsonC.message !== undefined ) {
    pr.setMessage(jsonC.message)
    }
  
  pr.pP( { msg: "default", type: "default" } ) 
  pr.pP( { msg: "white", type: "white" } ) 
  pr.pE( { msg: "error" } )
  pr.pI({msg: "info"})
  pr.pD({msg:"debug"})

  pr.pP({msg: "unit and unit+number tests", type: "white"})
  pr.pP({msg: "dateUnit, unit not set", type: "white", template: "dateUnit"})
  pr.pP({msg: "dateUnit", template: "dateUnit", unit: "WHITE"})
  pr.pE({msg: "dateUnitNumber, all set", template: "dateUnitNumber", unit: "ERR", number: "1111"})
  pr.pE({msg: "dateUnitNumber, all not set", template: "dateUnitNumber"})
})