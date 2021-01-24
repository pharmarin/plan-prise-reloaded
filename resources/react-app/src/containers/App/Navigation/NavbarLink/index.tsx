import Arrow from 'components/Icons/Arrow';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import joinClassNames from 'utility/class-names';

const NavbarLink = ({
  className,
  component,
  event,
  label,
  path,
}: {
  className?: string;
  component?: {
    name: string;
    props?: any;
  };
  event?: string;
  label?: string;
  path?: string;
}) => {
  const location = useLocation().pathname;

  const isActive = location === path;

  const components: { [key: string]: React.FC<{ className?: string }> } = {
    arrowLeft: Arrow.Regular.Left.Small,
  };

  const defaultClassNames = 'text-sm font-medium text-green-100';

  let displayedLabel;

  if (component) {
    const DisplayedComponent = components[component.name];
    displayedLabel = (
      <DisplayedComponent
        className={joinClassNames('h-5 w-5', defaultClassNames)}
        {...(component.props || {})}
      />
    );
  } else {
    displayedLabel = label;
  }

  if (event) {
    return (
      <button onClick={() => dispatchEvent(new Event(event))}>
        {displayedLabel}
      </button>
    );
  }

  return (
    <Link
      className={joinClassNames('px-3 py-2', defaultClassNames, {
        'text-blue': isActive,
      })}
      to={path || '/'}
    >
      {displayedLabel}
    </Link>
  );
};

export default observer(NavbarLink);
