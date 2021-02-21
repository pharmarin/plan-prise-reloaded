import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import TextFit from 'components/TextFit';
import { useNavigation } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useEffect, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Link, Redirect } from 'react-router-dom';
import joinClassNames from 'tools/class-names';

const Selection = observer(
  ({ list, isLoading }: { list?: PlanPrise[]; isLoading: boolean }) => {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [redirect, setRedirect] = useState(false);

    const navigation = useNavigation();

    const isReady = !isLoading && list !== undefined;

    useEffect(() => {
      navigation.setNavigation(
        isReady ? 'Que voulez-vous faire ?' : 'Chargement en cours',
        {
          component: {
            name: 'arrowLeft',
          },
          path: '/',
        }
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
        return <Redirect to={`/plan-prise/${search}`} />;
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
                Accès rapide au plan de prise #
              </div>
              <Input
                autoFocus
                className={joinClassNames('pl-60 text-center', {
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
            <Link to="/plan-prise/nouveau">
              <TextFit text="new" />
            </Link>
          </Card>
          {(
            list ||
            Array.from({ length: 4 }, () => runInAction(() => new PlanPrise()))
          ).map((planPrise, key) => (
            <Card
              key={planPrise.meta.id || key + '_'}
              className="h-32 w-32 m-auto p-2"
            >
              <ReactPlaceholder
                className="animate-pulse m-0"
                ready={isReady}
                type="rect"
              >
                <Link
                  key={planPrise.meta.id}
                  to={`/plan-prise/${planPrise.meta.id}`}
                >
                  <TextFit text={`#${planPrise.meta.id}`} />
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
