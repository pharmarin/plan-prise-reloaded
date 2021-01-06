import { AxiosRequestConfig } from 'axios';
import { Collection } from 'datx';
import { config, jsonapi } from 'datx-jsonapi';
import axios from 'helpers/axios-clients';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import Precaution from 'models/Precaution';
import PrincipeActif from 'models/PrincipeActif';
import User from 'models/User';

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
  static types = [
    ApiMedicament,
    Medicament,
    PlanPrise,
    Precaution,
    PrincipeActif,
    User,
  ];
}

export default JsonApiStore;
