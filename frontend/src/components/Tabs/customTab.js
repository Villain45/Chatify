import React from 'react';
import { Tabs, TabList, TabPanels, TabPanel,useTab ,useMultiStyleConfig, Button ,Box } from '@chakra-ui/react'
import Login from '../authentication/Login'
import SignUp from '../authentication/SignUp'

function CustomTabs() {
  const CustomTab = React.forwardRef((props, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ...props, ref })
    const isSelected = !!tabProps['aria-selected']

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps)

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Box as='span' mr='2'>
          {isSelected ? '😎' : '😐'}
        </Box>
        {tabProps.children}
      </Button>
    )
  })

  return (
    <Tabs>
      <TabList>
        <CustomTab w="50%">Login</CustomTab>
        <CustomTab w="50%">SignUp</CustomTab>
      </TabList>
      <TabPanels>
        <TabPanel> <Login /> </TabPanel>
        <TabPanel> <SignUp /> </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default CustomTabs;