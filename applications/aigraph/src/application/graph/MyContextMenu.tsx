import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ListItem,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../../components/ui/navigation-menu';

import { useAppState } from '../store';

const MyContextMenu = ({ targetType, onClose = () => { } }: any) => {
  console.log('targetType node,edge or canvas', targetType);
  const { graph } = useAppState();
  const [, setVisible] = useState(true);
  useEffect(() => {
    if (graph) {
      graph.on('contextmenu', (e) => {
        console.log('32i4rue32890u89032uj89032j890jh3280j328ifj2389iojio', e);
      });
    }
  }, [graph, onClose]);
  // useEffect(() => {
  //   const handleClickOutside = (event: any) => {
  //     if (!event.target.closest('.g6-contextmenu')) {
  //       setTimeout(() => {
  //         setVisible(false);
  //         onClose();
  //       }, 150);
  //     }
  //   };

  //   const timer = setTimeout(() => {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }, 0);

  //   return () => {
  //     clearTimeout(timer);
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [onClose]);

  const menu = (): JSX.Element => {
    if (targetType === 'node') {
      return (
        <NavigationMenu className="cursor-default">
          <NavigationMenuList>
            <NavigationMenuItem>
              <ListItem>node</ListItem>
              <ListItem>删除</ListItem>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );
    } else if (targetType === 'edge') {
      return (
        <NavigationMenu className="cursor-default">
          <NavigationMenuList>
            <NavigationMenuItem>
              <ListItem>edge</ListItem>
              <ListItem>删除</ListItem>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );
    } else if (targetType === 'canvas') {
      return (
        <NavigationMenu className="cursor-default">
          <NavigationMenuList>
            <NavigationMenuItem>
              <ListItem>canvas</ListItem>
              <ListItem>删除</ListItem>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );
    }
    return <></>;
  };

  return createPortal(
    <div id="context-menu" className="fixed bg-white rounded-md shadow-md dark:bg-slate-950">
      {menu()}
    </div>,
    document.body
  );
};

export default MyContextMenu;