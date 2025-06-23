import Home from '@/components/pages/Home';
import Today from '@/components/pages/Today';
import Week from '@/components/pages/Week';
import All from '@/components/pages/All';
import Categories from '@/components/pages/Categories';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  week: {
    id: 'week',
    label: 'This Week',
    path: '/week',
    icon: 'CalendarDays',
    component: Week
  },
  all: {
    id: 'all',
    label: 'All Tasks',
    path: '/all',
    icon: 'ListTodo',
    component: All
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tags',
    component: Categories
  }
};

export const routeArray = Object.values(routes);
export default routes;