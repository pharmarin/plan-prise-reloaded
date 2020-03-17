export default class PPItem {
  constructor(props) {
    this.customData = props.customData
    this.medicament = props.medicament
    this.input = props.input

    this.defaultValue = _.get(this.medicament, this.input.id, [])
    this.customValue = _.get(this.customData, this.input.id, [])
    this.needChoice = this.input.multiple || (this.customValue.length === 0 && Array.isArray(this.defaultValue) && this.defaultValue.length > 1)
    this.addedData = _.get(this.customData, `custom_${this.input.id}`, [])
  }

  get values() {
    if (this.input.id === 'denomination') {
      return [
        { text: this.medicament.custom_denomination, style: 'custom_denomination' },
        { text: this.medicament.compositions.map(composition => composition.denomination).join(' + '), style: 'compositions' },
        { text: `(Voies administration)`, style: 'voies_administration' }
      ]
    }
    let returnValue = this.customValue.length > 0 ? this.customValue : this.defaultValue
    if (this.needChoice) {
      if (this.input.multiple) {
        return _.concat(
          this.defaultValue.map(item => {
            let customItemData = _.get(this.customValue, `${item.id}.${this.input.display}`, _.get(item, this.input.display, ""))
            let customItemChecked = _.get(this.customValue, `${item.id}.checked`, item.population === null)
            if (!customItemChecked) return null
            return { text: customItemData }
          }),
          Object.values(this.addedData).map(item => item.checked === true ? _.get(item, `custom_${this.input.id}`, null) : null)
        )
      } else {
        return this.input.join ? this.returnValue.map(item => _.get(item, this.input.display, null)).join(this.input.join) : null
      }
    } else {
      if (_.isArray(returnValue)) {
        return this.input.join ? returnValue.map(item => _.get(item, this.input.display, null)).join(this.input.join) : null
      } else {
        return { text: returnValue }
      }
    }
    return JSON.stringify(returnValue)
  }
}
