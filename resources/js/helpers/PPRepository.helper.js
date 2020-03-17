import _ from 'lodash';

class PPItem {
  constructor(props) {
    this.props = props
  }

  get values() {
    let { addedData, customValue, defaultValue, input, medicament, needChoice } = this.props
    if (!medicament) return []
    if (input.id === 'denomination') {
      return [
        medicament.custom_denomination,
        medicament.compositions.map(composition => composition.denomination).join(' + '),
        `(Voies administration)`
      ]
    }
    let returnValue = customValue.length > 0 ? customValue : defaultValue
    if (needChoice) {
      if (input.multiple) {
        return _.concat(
          defaultValue.map(item => {
            let customItemData = _.get(customValue, `${item.id}.${input.display}`, _.get(item, input.display, ""))
            let customItemChecked = _.get(customValue, `${item.id}.checked`, item.population === null)
            let customItemHelp = _.get(item, input.help, _.get(input, 'label', null))
            return {
              checked: customItemChecked,
              value: customItemData,
              help: customItemHelp,
              id: item.id
            }
          }),
          Object.values(addedData).map((item, i) => ({
            value: _.get(item, `custom_${input.id}`, null),
            checked: item.checked,
            id: Object.keys(addedData)[i],
            addedData: true
          }))
        )
      } else {
        return returnValue.map(item => ({
          value: _.get(item, input.display, null),
          choose: _.get(item, input.choose, null)
        }))
      }
    } else {
      if (_.isArray(returnValue)) {
        switch (returnValue.length) {
          case 0:
            return null
          case 1:
            return returnValue[0][input.display]
          default:
            return returnValue.map(item => _.get(item, input.display, null))
        }
      } else {
        return returnValue
      }
    }
  }
}

export default class PPRepository {
  constructor(props) {
    this.content = props.content || []
    this.customData = props.customData || []
    this.data = props.data || []
    this.emptyObject = props.emptyObject
    this.settings = props.settings || []

    this.valuesObject = {}
    this.needChoiceObject = {}
    this.init()
  }

  get columns() {
    return this.getColumns()
  }

  getColumns = () => {
    let inputs = _.cloneDeep(window.php.default.inputs)
    let posologies = inputs.posologies.inputs

    inputs.posologies.inputs = _.compact(Object.keys(posologies).map((key) => {
      let posologie = posologies[key]
      let isChecked = _.get(this.settings, `inputs.${posologie.id}.checked`, null)
      let isDefault = posologie.default
      let isDisplayed = isChecked || (isChecked === null && isDefault)
      return isDisplayed ? posologie : null
    }))

    return [
      {
        header: "Médicament",
        id: 'denomination',
        multiple: true
      },
      ...inputs.properties.inputs.map(input => ({
        header: input.label,
        ...input
      })),
      ...inputs.posologies.inputs.map(input => ({
        header: input.label,
        poso: true,
        ...input
      })),
      ...inputs.commentaires.inputs.map(input => ({
        header: input.label,
        ...input
      }))
    ]
  }

  get inputs() {
    let inputs = _.cloneDeep(window.php.default.inputs)
    let posologies = inputs.posologies.inputs

    inputs.posologies.inputs = _.compact(Object.keys(posologies).map((key) => {
      let posologie = posologies[key]
      let isChecked = _.get(this.settings, `inputs.${posologie.id}.checked`, null)
      let isDefault = posologie.default
      let isDisplayed = isChecked || (isChecked === null && isDefault)
      return isDisplayed ? posologie : null
    }))

    return inputs
  }

  init = () => {
    this.valuesObject = this.content.map(line => {
      let lineObject = {}
      let medicament = _.find(this.data, line)
      this.columns.forEach(column => {
        let defaultValue = _.get(medicament, `data.${column.id}`, [])
        let customValue = _.get(this.customData, `${line.id}.${column.id}`, [])
        let needChoice = column.multiple || (customValue.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 1)
        let addedData = _.get(this.customData, `${line.id}.custom_${column.id}`, [])
        let item = new PPItem({
          defaultValue,
          customValue,
          needChoice,
          addedData,
          medicament: _.get(medicament, 'data', null),
          input: column
        })
        _.set(lineObject, column.id, item.values)
        if (needChoice && !column.multiple) {
          _.set(this.needChoiceObject, line.id, _.concat(_.get(this.needChoiceObject, line.id, []), [column.id]))
        }
      })
      return {
        line: line,
        state: _.get(medicament, 'state', null),
        data: lineObject
      }
    })
  }

  isLoaded = (medicament) => {
    let details = _.find(this.data, medicament)
    return (details.data || !details.state.isLoading)
  }

  get values() {
    return this.valuesObject.map(object => _.mapValues(object.data, (value, key) => {
      if (_.isString(value)) return { text: value, style: key }
      if (_.isArray(value)) {
        let input = _.find(this.columns, { id: key })
        if (input.multiple) return { stack: value.map(i => ({ text: _.isString(i) ? i : i.value, style: key })) }
        if (input.join) return { text: value.map(i => _.isString(i) ? i : i.value).join(input.join) }
        return ""
      }
    }))
  }

  get needChoice() {
    return this.needChoiceObject
  }
}
