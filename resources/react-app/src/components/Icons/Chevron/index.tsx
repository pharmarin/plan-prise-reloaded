import {
  BiChevronDown,
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';

const Chevron = {
  Single: {
    Down: { Medium: undefined, Small: BiChevronDown },
    Left: { Medium: undefined, Small: BiChevronLeft },
    Right: { Medium: undefined, Small: BiChevronRight },
    Up: { Medium: undefined, Small: undefined },
  },
  Double: {
    Down: { Medium: undefined, Small: undefined },
    Left: { Medium: undefined, Small: BiChevronsLeft },
    Right: { Medium: undefined, Small: BiChevronsRight },
    Up: { Medium: undefined, Small: undefined },
  },
};

export default Chevron;
