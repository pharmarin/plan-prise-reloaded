import Arrow from 'components/Icons/Arrow';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { deleteContent, setShowSettings } from 'store/plan-prise';
import joinClassNames from 'utility/class-names';

const mapDispatch = { deleteContent, setShowSettings };

const connector = connect(null, mapDispatch);

type NavbarLinkProps = ConnectedProps<typeof connector> &
  Props.Frontend.App.NavbarLink;

const NavbarLink = ({
  args,
  className,
  component,
  event,
  label,
  path,
}: NavbarLinkProps) => {
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

export default connector(NavbarLink);
