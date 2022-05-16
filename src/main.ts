import * as core from '@actions/core'
import * as fs from 'fs'
import * as jsYaml from 'js-yaml'
import {JSONPath} from 'jsonpath-plus'

function yamlFileToJSONStr(file: string): JSON {
  const yamlBody = fs.readFileSync(file, 'utf8')
  const jsonContent = jsYaml.load(yamlBody) as JSON

  if (jsonContent === null || jsonContent === undefined) {
    core.setFailed('Error in reading the yaml file')
  }

  return jsonContent
}

async function run(): Promise<void> {
  // extract inputs
  const yamlFile: string = core.getInput('yamlFile', {required: true})
  const pathsInput: string = core.getInput('paths', {required: true})
  const failUndefinedValue =
    core.getInput('failUndefinedValue').toLowerCase() === 'true' ? true : false
  const failObjectValue =
    core.getInput('failObjectValue').toLowerCase() === 'true' ? true : false

  try {
    // read file
    const yamlContentAsJSON = yamlFileToJSONStr(yamlFile)

    // extract outputs
    const paths = pathsInput
      .split(';')
      .filter(path => !!path)
      .map(path => path.trim())
      .filter(path => path.length !== 0)

    for (const path of paths) {
      let keyPath = path
      let outputVarName = null

      const outputVarDelimiterIndex = path.lastIndexOf('|')

      if (outputVarDelimiterIndex > -1) {
        keyPath = path.substring(0, outputVarDelimiterIndex).trim()
        outputVarName = path.substring(outputVarDelimiterIndex + 1).trim()
      }

      const keyPathParts = keyPath
        .split('.')
        .map(part => part.trim())
        .filter(part => part.length !== 0)

      outputVarName = outputVarName
        ? outputVarName
        : keyPathParts[keyPathParts.length - 1]

      let outputVarValue = JSONPath({
        path: `$.${keyPath}`,
        json: yamlContentAsJSON,
        wrap: false
      })

      if (typeof outputVarValue === 'undefined') {
        if (failUndefinedValue) {
          core.setFailed(`Path ${keyPath} has null value or does not exists.`)
        } else {
          core.warning(`Path ${keyPath} has null value or does not exists.`)
        }
      } else {
        if (typeof outputVarValue === 'object') {
          if (failObjectValue) {
            core.setFailed(
              `Path ${keyPath} value is an Object and not primitive value.`
            )
          } else {
            core.warning(
              `Path ${keyPath} value is an Object and not primitive value.`
            )
          }
        }
        outputVarValue = JSON.stringify(outputVarValue).trim()
      }

      core.setOutput(outputVarName, outputVarValue)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
