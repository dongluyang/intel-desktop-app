/*
 * Set of function to facilitate the display and edition of metadata in
 * entity lists.
 */
export const descriptorMixin = {

  created () {
  },

  mounted () {
  },

  beforeDestroy () {
  },

  computed: {
    descriptorLength () {
      return this.shotMetadataDescriptors
        ? this.shotMetadataDescriptors.length
        : this.assetMetadataDescriptors.length
    }
  },

  methods: {
    onAddMetadataClicked () {
      this.$emit('add-metadata')
    },

    emitMetadataChanged (entry, descriptor, value) {
      this.$emit('metadata-changed', {
        entry, descriptor, value
      })
    },

    // onMetadataFieldChanged (entry, descriptor, event) {
    //   if (this.selectedShots.has(entry.id)) {
    //     // if the line is selected, also modify the cells of the other selected lines
    //     this.selectedShots.forEach((shot, _) => {
    //       this.emitMetadataChanged(shot, descriptor, event.target.value)
    //     })
    //   } else if (this.selectedAssets.has(entry.id)) {
    //     // if the line is selected, also modify the cells of the other selected lines
    //     this.selectedAssets.forEach((asset, _) => {
    //       this.emitMetadataChanged(asset, descriptor, event.target.value)
    //     })
    //   } else {
    //     this.emitMetadataChanged(entry, descriptor, event.target.value)
    //   }
    // },

    onSortByMetadataClicked () {
      const columnId = this.lastMetadaDataHeaderMenuDisplayed
      const column =
        this.currentProduction.descriptors.find(d => d.id === columnId)
      this.$emit('change-sort', {
        type: 'metadata',
        column: column.field_name,
        name: column.name
      })
      this.showMetadataHeaderMenu()
    },

    onEditMetadataClicked () {
      this.$emit('edit-metadata', this.lastMetadaDataHeaderMenuDisplayed)
      this.showMetadataHeaderMenu()
    },

    onDeleteMetadataClicked () {
      this.$emit('delete-metadata', this.lastMetadaDataHeaderMenuDisplayed)
      this.showMetadataHeaderMenu()
    },

    showMetadataHeaderMenu (columnId, event) {
      const headerMenuEl = this.$refs.headerMetadataMenu.$el
      if (headerMenuEl.className === 'header-menu') {
        headerMenuEl.className = 'header-menu hidden'
      } else {
        headerMenuEl.className = 'header-menu'
        const headerElement = event.srcElement.parentNode.parentNode
        const headerBox = headerElement.getBoundingClientRect()
        const left = headerBox.left
        const top = headerBox.bottom
        const width = Math.max(100, headerBox.width - 1)
        headerMenuEl.style.left = left + 'px'
        headerMenuEl.style.top = top + 'px'
        headerMenuEl.style.width = width + 'px'
      }
      this.lastMetadaDataHeaderMenuDisplayed = columnId
    },

    getDescriptorChoicesOptions (descriptor) {
      const values = descriptor.choices.map(c => ({ label: c, value: c }))
      return [{ label: '', value: '' }, ...values]
    },

    getMetadataFieldValue (descriptor, entity) {
      return entity.data ? entity.data[descriptor.field_name] || '' : ''
    },

    /*
     * Determine what is the next input by building a reference key and
     * retrieve it from the main reference array.
     * The next input is determined from the arrow key used. If the key is
     * not an arrow nothing is done.
     */
    keyMetadataNavigation (listWidth, listHeight, i, j, key) {
      if (key === 'ArrowDown') {
        i = i + 1
        if (i >= listHeight) i = 0
      } else if (key === 'ArrowLeft') {
        j = j - 1
        if (j < 0) j = listWidth - 1
      } else if (key === 'ArrowRight') {
        j = j + 1
        if (j >= listWidth) j = 0
      } else if (key === 'ArrowUp') {
        i = i - 1
        if (i < 0) i = listHeight - 1
      } else {
        return
      }
      const ref = `editor-${i}-${j}`
      const input = this.$refs[ref][0]
      input.focus()
    }
  }
}
