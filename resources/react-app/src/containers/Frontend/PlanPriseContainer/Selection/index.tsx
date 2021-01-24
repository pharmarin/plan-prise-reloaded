import { AsyncStatus } from '@react-hook/async';
import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import { useNavigation } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useEffect, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';
import { Link, Redirect } from 'react-router-dom';
import joinClassNames from 'utility/class-names';

const TextFit: React.FC<{ text: string }> = observer(({ text }) => {
  const length = text.length;
  const fontSize = 100 - 14 * length;
  return (
    <svg
      className={joinClassNames('fill-current text-indigo-600', {
        'text-green-500': text === 'new',
      })}
      viewBox={`0 0 100 100`}
    >
      {text === 'new' ? (
        [
          <text
            key="+"
            x="50"
            y="30"
            style={{
              fontSize: 80,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            +
          </text>,
          <text
            key="new"
            x="50"
            y="80"
            style={{
              fontSize: 20,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            Nouveau
          </text>,
        ]
      ) : (
        <text
          key={text}
          x="50"
          y="50"
          style={{
            fontSize: fontSize,
            dominantBaseline: 'central',
            textAnchor: 'middle',
          }}
        >
          {text}
        </text>
      )}
    </svg>
  );
});

const Selection = observer(
  ({ list, status }: { list?: PlanPrise[]; status: AsyncStatus }) => {
    const navigation = useNavigation();

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      navigation.setNavigation(
        status === 'success'
          ? 'Que voulez-vous faire ?'
          : 'Chargement en cours',
        {
          component: {
            name: 'arrowLeft',
          },
          path: '/',
        }
      );
    }, [navigation, status]);

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
        <div className="mx-auto">
          <ReactPlaceholder
            type="textRow"
            showLoadingAnimation={true}
            ready={status === 'success'}
          >
            <Form onSubmit={handleSearchSubmit}>
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
        </div>
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
                type="rect"
                showLoadingAnimation={true}
                ready={status === 'success'}
                className="m-0"
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