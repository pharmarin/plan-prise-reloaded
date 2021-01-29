import Arrow from 'components/Icons/Arrow';
import Options from 'components/Icons/Options';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { INavigationItem } from 'store/navigation';
import joinClassNames from 'tools/class-names';

const NavbarLink = ({
  className,
  component,
  event,
  label,
  path,
}: {
  className?: string;
} & INavigationItem) => {
  const location = useLocation().pathname;

  const isActive = location === path;

  const components: { [key: string]: React.FC<{ className?: string }> } = {
    arrowLeft: Arrow.Regular.Left,
    options: Options.Connected,
  };

  const defaultClassNames = 'text-sm font-medium text-green-100';

  let displayedLabel;

  if (component) {
    const DisplayedComponent = components[component.name];
    displayedLabel = (
      <DisplayedComponent
        className={joinClassNames('h-5 w-5', defaultClassNames, className)}
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
