export const addDetailsToState = (state, medicaments) => {
  if (!Array.isArray(medicaments)) medicaments = [medicaments]

  medicaments.map((medicament) => {
    medicament = { ...medicament, ...medicament.value }
    const key = _.findIndex(state.data, item => item.id === medicament.id && item.type === medicament.type)

    if (key === -1) {
      state.data.push({
        ...state.empty,
        ...medicament.value, //id + denomination
        type: medicament.type,
        data: medicament.data
      })
    } else {
      _.set(state, `data.${key}.data`, medicament.data)
    }
  })

  return state
}
