import React from 'react';
import {
  FaArrowLeft,
  FaCog,
  FaFilePdf,
  FaPrint,
  FaTrash,
} from 'react-icons/fa';
import { connect, ConnectedProps } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button, NavItem, NavLink } from 'reactstrap';
import { setShowSettings } from 'store/app';
import { loadList, manage, setId } from 'store/plan-prise';

const mapDispatch = { loadList, manage, setId, setShowSettings };

const connector = connect(null, mapDispatch);

type NavbarLinkProps = ConnectedProps<typeof connector> & Props.NavbarLinkProps;

const NavbarLink = ({
  args,
  className,
  label,
  light,
  loadList,
  manage,
  path,
  setId,
  setShowSettings,
}: NavbarLinkProps) => {
  const location = useLocation().pathname;
  const isActive = location === path;

  const switchLabel = (string: string) => {
    if (string === 'arrow-left') return <FaArrowLeft />;
    if (string === 'cog') return <FaCog />;
    if (string === 'pdf') return <FaFilePdf />;
    if (string === 'printer') return <FaPrint />;
    if (string === 'trash') return <FaTrash />;
    return string;
  };

  const switchTag = (path: string, args?: any) => {
    if (path === 'settings')
      return {
        action: () => setShowSettings(true),
        tag: Button,
      };
    if (path === 'pp-delete')
      return {
        action:
          args && args.id
            ? () => manage({ id: args.id, action: 'delete' })
            : undefined,
        tag: Button,
      };
    return { tag: Link };
  };

  const { action, tag } = switchTag(path, args);

  return (
    <NavItem className={(className || '') + ' mr-3'}>
      <NavLink
        active={isActive}
        color="link"
        disabled={isActive}
        onClick={action}
        to={path}
        tag={tag}
      >
        <span
          className={
            'nav-link-inner--text' +
            (isActive ? ' text-white-50' : light ? ' text-light' : '')
          }
        >
          {switchLabel(label)}
        </span>
      </NavLink>
    </NavItem>
  );
};

export default connector(NavbarLink);
