import acts from '@/enums/actions'

export const state = () => ({
    action: 0,
    catalog: undefined,
    document: undefined,
    fileList: [],
    image: undefined,
    query: undefined,
    selectedItem: {},
})

export const mutations = {
    changeAction(state, newAction) {
        state.action = newAction
    },
    changeSelectedItem(state, selectedItem) {
        state.selectedItem = selectedItem
    },
    changeCatalog(state, catalog){
        state.catalog = catalog
    },
    changeQuery(state, query){
        state.query = query
    },
    updateName(state, value){
        state.selectedItem.name = value
    },
    updateDescription(state, value){
        state.selectedItem.description = value
    },
    updateImage(state, image){
        state.image = image
    },
    updateDocument(state, doc){
        state.document = doc
    },
    addVideo(state, video){
        state.selectedItem.videos.push( video )
    },
    updateVideo(state, {index, value}) {
        state.selectedItem.videos[index].vimeo_id = value
    },
    updateVideoList(state, videoList) {
        state.selectedItem.videos = videoList
    },
    addFile(state, {idx, file}) {
        state.fileList.splice(idx, 1, file)
    },
    updateTipoProducto(state, id){
        state.selectedItem.tipoProducto = {id}
    }
}

export const getters = {
    selectedItemId: state => state.selectedItem ? state.selectedItem.id : -1,
    tipoProductoId: state => state.selectedItem ? state.selectedItem.tipoProducto.id : 1,
    videos: state => state.selectedItem.videos ? state.selectedItem.videos.filter( video => video.vimeo_id !== null) : [],
    videosLength: state => state.selectedItem ? state.selectedItem.videos.length : 0,
    catalogId: state => state.catalog ? state.catalog.id : undefined ,
    vimeoId: state => idx => state.selectedItem.videos[idx].vimeo_id,
    fileList: state => state.fileList ? state.fileList : [],
    docName: state => state.document ? state.document.name : undefined,
    imageName: state => state.image ? state.image.name : undefined,
}

export const actions = {
    manageFile({state, commit}, file){
        let idx = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name) ? 0 : 1
        commit('addFile', {idx, file})
    },
    updateCache( { state, getters } , { store, res } ){
        const query = {query: state.query };

        const data = store.readQuery( query )

        if(state.action === acts.CREATE){
            data[ getters.catalogId ].push(res)
        }

        if(state.action === acts.DELETE){
            let index = data[ getters.catalogId ].findIndex( obj => obj.id === res.id )
            data[ getters.catalogId ].splice(index, 1)
        }

        // Write back to the cache
        store.writeQuery({
            ...query,
            data,
        })
    }
}