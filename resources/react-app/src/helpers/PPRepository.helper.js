import concat from 'lodash/concat';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import toLower from 'lodash/toLower';
import values from 'lodash/values';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import compact from 'lodash/compact';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import set from 'lodash/set';

class PPItem {
  constructor(props) {
    this.props = props;
  }

  get values() {
    const {
      addedData,
      customValue,
      defaultValue,
      input,
      medicament,
      needChoice,
    } = this.props;
    if (!medicament) return [];
    if (input.id === 'denomination') {
      return [
        {
          value: medicament.custom_denomination,
          style: 'custom_denomination',
        },
        {
          value: map(medicament.compositions, 'denomination').join(
            ' + ',
          ),
          style: 'compositions',
        },
        {
          value: `(Voie ${
            toLower(
              window.php.default.voies_administration[
                medicament.voies_administration
              ],
            ) || ''
          })`,
          style: 'voies_administration',
        },
      ];
    }
    const returnValue =
      customValue.length > 0 ? customValue : defaultValue;
    if (needChoice) {
      if (input.multiple) {
        return concat(
          map(defaultValue, (item) => {
            const customItemData = get(
              customValue,
              `${item.id}.${input.display}`,
              get(item, input.display, ''),
            );
            const customItemChecked = get(
              customValue,
              `${item.id}.checked`,
              item.population === null,
            );
            const customItemHelp = get(
              item,
              input.help,
              get(input, 'label', null),
            );
            return {
              checked: customItemChecked,
              value: customItemData,
              help: customItemHelp,
              id: item.id,
            };
          }),
          map(values(addedData), (item, i) => ({
            value: get(item, `custom_${input.id}`, null),
            checked: item.checked,
            id: keys(addedData)[i],
            addedData: true,
          })),
        );
      }
      return map(returnValue, (item) => ({
        value: get(item, input.display, null),
        choose: get(item, input.choose, null),
      }));
    }
    if (isArray(returnValue)) {
      switch (returnValue.length) {
        case 0:
          return null;
        case 1:
          return returnValue[0][input.display];
        default:
          return map(returnValue, (item) =>
            get(item, input.display, null),
          );
      }
    } else {
      return returnValue;
    }
  }
}

export default class PPRepository {
  constructor(props) {
    this.content = props.content || [];
    this.customData = props.customData || [];
    this.data = props.data || [];
    this.settings = props.settings || [];
    this.valuesObject = {};
    this.needChoiceObject = {};
    this.init();
  }

  get columns() {
    return this.getColumns();
  }

  getColumns = () => {
    const inputs = cloneDeep(window.php.default.inputs);
    const posologies = inputs.posologies.inputs;

    inputs.posologies.inputs = compact(
      map(keys(posologies), (key) => {
        const posologie = posologies[key];
        const isChecked = get(
          this.settings,
          `inputs.${posologie.id}.checked`,
          null,
        );
        const isDefault = posologie.default;
        const isDisplayed =
          isChecked || (isChecked === null && isDefault);
        return isDisplayed ? posologie : null;
      }),
    );

    return [
      {
        header: 'Médicament',
        id: 'denomination',
        multiple: true,
      },
      ...map(inputs.properties.inputs, (input) => ({
        header: input.label,
        ...input,
      })),
      ...map(inputs.posologies.inputs, (input) => ({
        header: input.label,
        poso: true,
        ...input,
      })),
      ...map(inputs.commentaires.inputs, (input) => ({
        header: input.label,
        ...input,
      })),
    ];
  };

  get inputs() {
    const inputs = cloneDeep(window.php.default.inputs);
    const posologies = inputs.posologies.inputs;

    inputs.posologies.inputs = compact(
      map(keys(posologies), (key) => {
        const posologie = posologies[key];
        const isChecked = get(
          this.settings,
          `inputs.${posologie.id}.checked`,
          null,
        );
        const isDefault = posologie.default;
        const isDisplayed =
          isChecked || (isChecked === null && isDefault);
        return isDisplayed ? posologie : null;
      }),
    );

    return inputs;
  }

  init = () => {
    this.valuesObject = map(this.content, (line) => {
      const lineObject = {};
      const medicament = find(this.data, line);
      forEach(this.columns, (column) => {
        const defaultValue = get(medicament, `data.${column.id}`, []);
        const customValue = get(
          this.customData,
          `${line.id}.${column.id}`,
          [],
        );
        const needChoice =
          column.multiple ||
          (customValue.length === 0 &&
            isArray(defaultValue) &&
            defaultValue.length > 1);
        const addedData = get(
          this.customData,
          `${line.id}.custom_${column.id}`,
          [],
        );
        const item = new PPItem({
          defaultValue,
          customValue,
          needChoice,
          addedData,
          medicament: get(medicament, 'data', null),
          input: column,
        });
        set(lineObject, column.id, item.values);
        if (needChoice && !column.multiple) {
          set(
            this.needChoiceObject,
            line.id,
            concat(get(this.needChoiceObject, line.id, []), [
              column.id,
            ]),
          );
        }
      });
      return {
        line,
        state: get(medicament, 'state', null),
        data: lineObject,
      };
    });
  };

  isLoading = (medicament) => {
    const details = find(this.data, medicament);
    if (!details) return false;
    return details.state.isLoading;
  };

  isLoaded = (medicament) => {
    const details = find(this.data, medicament) || {
      data: null,
      state: { isLoading: false },
    };
    return details.data && !details.state.isLoading;
  };

  get values() {
    return map(this.valuesObject, (object) =>
      mapValues(object.data, (value, key) => {
        if (isString(value)) return { text: value, style: key };
        if (isArray(value)) {
          const input = find(this.columns, { id: key });
          if (input.multiple)
            return {
              stack: map(value, (i) => ({
                text: isString(i) ? i : i.value,
                style: i.style ? i.style : key,
              })).flatMap((e, index) =>
                index
                  ? [e, { text: ' ', style: 'interline' }]
                  : [e, { text: ' ', style: 'interline' }],
              ), // add interline https://stackoverflow.com/questions/46528616/how-to-insert-a-new-element-in-between-all-elements-of-a-js-array
            };
          if (input.join)
            return {
              text: map(value, (i) =>
                isString(i) ? i : i.value,
              ).join(input.join),
            };
        }
        return '';
      }),
    );
  }

  get needChoice() {
    return this.needChoiceObject;
  }
}
