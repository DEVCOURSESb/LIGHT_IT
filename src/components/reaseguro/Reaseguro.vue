<template>
  <div class="text-center">
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text">
          Reaseguro
          <v-icon end>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="item in listItems" :key="item.name">
          <v-list-item
            v-if="item.items.length === 0"
            link
            :prepend-icon="item.icon || undefined"
            :to="`/reaseguro/${item.name}`"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-menu
            v-else
            offset-x
            :open-on-focus="false"
            open-on-hover
            submenu
          >
            <template #activator="{ props: menuProps }">
              <v-list-item v-bind="menuProps" link>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <template #append>
                  <v-icon size="x-small">mdi-menu-right</v-icon>
                </template>
              </v-list-item>
            </template>

            <v-list>
              <template v-for="subItem in item.items" :key="subItem.name">
                <v-list-item
                  v-if="subItem.items.length === 0"
                  link
                  :prepend-icon="subItem.icon || undefined"
                  :to="`/reaseguro/contratosReaseguro/${subItem.name}`"
                >
                  <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                </v-list-item>

                <v-menu
                  v-else
                  offset-x
                  :open-on-focus="false"
                  open-on-hover
                  submenu
                >
                  <template #activator="{ props: subMenuProps }">
                    <v-list-item v-bind="subMenuProps" link>
                      <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                      <template #append>
                        <v-icon size="x-small">mdi-menu-right</v-icon>
                      </template>
                    </v-list-item>
                  </template>

                  <v-list>
                    <template v-for="submenu in subItem.items" :key="submenu.name">
                      <v-list-item
                        v-if="submenu.items.length === 0"
                        link
                        :prepend-icon="submenu.icon || undefined"
                        :to="`/reaseguro/contratosReaseguro${submenu.name}`"
                      >
                        <v-list-item-title>{{ submenu.title }}</v-list-item-title>
                      </v-list-item>

                      <v-menu
                        v-else
                        offset-x
                        :open-on-focus="false"
                        open-on-hover
                        submenu
                      >
                        <template #activator="{ props: subSubMenuProps }">
                          <v-list-item v-bind="subSubMenuProps" link>
                            <v-list-item-title>{{ submenu.title }}</v-list-item-title>
                            <template #append>
                              <v-icon size="x-small">mdi-menu-right</v-icon>
                            </template>
                          </v-list-item>
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="subsubmenu in submenu.items"
                            :key="subsubmenu.name"
                            link
                            :prepend-icon="subsubmenu.icon || undefined"
                            :to="`/reaseguro/${subsubmenu.name}`"
                          >
                            <v-list-item-title>{{ subsubmenu.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list>
                </v-menu>
              </template>
            </v-list>
          </v-menu>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
  interface ListItem {
    name: string
    title: string
    icon: string
    items: ListItem[]
  }

  const listItems: ListItem[] = [
    {
      name: 'contratosReaseg',
      title: 'Contratos de reaseguro',
      icon: '',
      items: [
        { name: 'autos', title: 'Autos', icon: '', items: [] },
        {
          name: 'danios',
          title: 'Daños',
          icon: '',
          items: [
            { name: 'noProporcional', title: 'No proporcional', icon: '', items: [] },
            {
              name: 'proporcional',
              title: 'Proporcional',
              icon: '',
              items: [
                { name: 'nuevoContrato', title: 'Nuevo', icon: '', items: [] },
                { name: 'modificarContrato', title: 'Modificar', icon: '', items: [] },
                { name: 'visualizarContrato', title: 'Visualizar', icon: '', items: [] },
              ],
            },
          ],
        },
      ],
    },
    { name: 'bordereaux', title: 'Bordereaux reaseguro', icon: '', items: [] },
    { name: 'estadosCuentaReaseg', title: 'Estados de cuenta reaseguro', icon: '', items: [] },
    { name: 'reportesReaseguro', title: 'Reportes de reaseguro', icon: '', items: [] },
    { name: 'RR6', title: 'RR6', icon: '', items: [] },
  ]
</script>
