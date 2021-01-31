import { Collection, IRawCollection, IRawModel } from '@datx/core';
import { config, jsonapi } from '@datx/jsonapi';
import { AxiosRequestConfig } from 'axios';
import axios from 'helpers/axios-clients';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import Precaution from 'models/Precaution';
import PrincipeActif from 'models/PrincipeActif';
import User from 'models/User';
import RootStore from './root';

config.baseFetch = (method, url, body, requestHeaders, fetchOptions) =>
  axios
    .request({
      headers: requestHeaders,
      method: method as AxiosRequestConfig['method'],
      url,
      data: body,
    })
    .then((response) => ({
      data: response.data,
      status: response.status,
      requestHeaders,
      headers: new Headers(response.headers),
    }));

class JsonApiStore extends jsonapi(Collection) {
  rootStore;

  static types = [
    ApiMedicament,
    Medicament,
    PlanPrise,
    Precaution,
    PrincipeActif,
    User,
  ];

  constructor(rootStore: RootStore, data?: IRawModel[] | IRawCollection) {
    super(data);

    this.rootStore = rootStore;
  }
}

export default JsonApiStore;
