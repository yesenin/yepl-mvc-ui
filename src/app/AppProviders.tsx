import type { PropsWithChildren } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { useRef } from 'react';
import type { AppStore } from './store';
import { createAppStore } from './store';
import { appTheme } from '../theme/theme';

type AppProvidersProps = PropsWithChildren<{
  store?: AppStore;
}>;

function AppProviders({ children, store }: AppProvidersProps) {
  const storeRef = useRef(store ?? createAppStore());

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}

export default AppProviders;
