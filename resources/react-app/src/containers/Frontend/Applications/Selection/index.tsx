import { Model } from '@datx/core';
import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import TextFit from 'components/TextFit';
import { useNavigation } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Link, Redirect } from 'react-router-dom';
import joinClassNames from 'tools/class-names';

const Selection = observer(
  ({
    baseUrl,
    list,
    name,
    isLoading,
  }: {
    baseUrl: string;
    list?: Model[];
    name: string;
    isLoading: boolean;
  }) => {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [redirect, setRedirect] = useState(false);

    const navigation = useNavigation();

    const isReady = !isLoading && list !== undefined;

    useEffect(() => {
      navigation.setNavigation(
        isReady ? 'Que voulez-vous faire ?' : 'Chargement en cours'
      );
    }, [navigation, isReady]);

    const searchSuccess =
      search &&
      Array.isArray(list) &&
      list.map((planPrise) => planPrise.meta.id).includes(search);

    const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value;
      if (inputValue.length === 0) return setSearch(undefined);
      const inputNumber = event.currentTarget.value;
      setSearch(inputNumber);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!search) return;
      setRedirect(true);
    };

    if (search) {
      if (searchSuccess && redirect)
        return <Redirect to={`/${baseUrl}/${search}`} />;
    }

    return (
      <div className="flex flex-col space-y-4">
        <ReactPlaceholder
          className="animate-pulse"
          ready={isReady}
          type="textRow"
        >
          <Form className="mx-auto" onSubmit={handleSearchSubmit}>
            <FormGroup>
              <div className="absolute mt-2 ml-2 text-gray-500">
                Accès rapide au {name} #
              </div>
              <Input
                autoFocus
                className={joinClassNames('h-10 pl-60 text-center', {
                  'border-green-600 text-green-600': search && searchSuccess,
                  'border-red-600 text-red-600': search && !searchSuccess,
                })}
                name="search"
                onChange={handleSearch}
                type="number"
                value={search || ''}
              />
            </FormGroup>
          </Form>
        </ReactPlaceholder>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          <Card className="h-32 w-32 m-auto p-2">
            <Link to={`/${baseUrl}/nouveau`}>
              <TextFit text="new" />
            </Link>
          </Card>
          {(
            list ||
            Array.from({ length: 4 }, () => runInAction(() => new Model()))
          )
            .slice()
            .reverse()
            .map((item, key) => (
              <Card
                key={item.meta.id || key + '_'}
                className="h-32 w-32 m-auto p-2"
              >
                <ReactPlaceholder
                  className="animate-pulse m-0"
                  ready={isReady}
                  type="rect"
                >
                  <Link key={item.meta.id} to={`/${baseUrl}/${item.meta.id}`}>
                    <TextFit text={`#${item.meta.id}`} />
                  </Link>
                </ReactPlaceholder>
              </Card>
            ))}
        </div>
      </div>
    );
  }
);

export default Selection;
