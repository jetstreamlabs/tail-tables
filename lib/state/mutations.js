import merge from 'merge'

export default function (self) {

    let extra = self.source == 'server' ?
        {
            [`${self.name}/SET_DATA`](state, response) {

                var data = self.opts.responseAdapter.call(self, response);

                state.data = self.opts.pagination.virtual && state.page !== 1 ? state.data.concat(data.data) : data.data;
                state.count = parseInt(data.count);
            },
            [`${self.name}/ERROR`](state, payload) {

            },
            [`${self.name}/SET_COUNT`](state, count) {
                state.count = count;
            }
        } :
        {
            [`${self.name}/SET_COUNT`](state, count) {
                state.count = count;
            }
        }

    return merge.recursive(true, {
        [`${self.name}/PAGINATE`](state, page) {
            if (page === 0) {
                page = 1
            }

            state.page = page;
            self.updateState('page', page);

            if (self.source == 'server')
                self.getData()

            self.commit('PAGINATION', page);
        },
        [`${self.name}/SET_FILTER`](state, filter) {
            state.page = 1;

            self.updateState('page', 1);

            state.query = filter;

            if (self.source == 'server') {
                self.getData()
            }
        },
        [`${self.name}/PAGINATION`](state, page) {

        },
        [`${self.name}/SET_CUSTOM_FILTER`](state, {filter, value}) {

            state.customQueries[filter] = value;
            state.page = 1;

            self.updateState('page', 1);
            self.updateState('customQueries', state.customQueries);

            if (self.source == 'server') {
                self.getData();
            }
        },
        [`${self.name}/SET_STATE`](state, {page, query, customQueries, limit, orderBy}) {
            if (customQueries) {
                state.customQueries = customQueries;
            }

            if (typeof query !== 'undefined') {
                state.query = query;
            }

            if (page) {
                state.page = page;
            }

            if (limit) {
                state.limit = limit;
            }

            if (typeof orderBy !== 'undefined') {
                state.ascending = orderBy.ascending;
                state.sortBy = orderBy.column;
            }
        },
        [`${self.name}/SET_LIMIT`](state, limit) {
            state.page = 1;
            self.updateState('page', 1);

            state.limit = limit;

            if (self.source == 'server')
                self.getData()
        },
        [`${self.name}/SORT`](state, {column, ascending}) {

            state.ascending = ascending;
            state.sortBy = column;

            if (self.source == 'server')
                self.getData()
        },
        [`${self.name}/SET_CLIENT_DATA`](state, data) {
            state.data = data
        },
        [`${self.name}/SORTED`](state, data) {

        },
        [`${self.name}/ROW_CLICK`](state, row) {

        },
        [`${self.name}/FILTER`](state, row) {

        },
        [`${self.name}/LIMIT`](state, limit) {

        },
        [`${self.name}/INPUT`](state, payload) {

        },
        [`${self.name}/UPDATE`](state, payload) {

        },
        [`${self.name}/LOADING`](state, payload) {

        },
        [`${self.name}/LOADED`](state, payload) {

        },
        [`${self.name}/SELECT`](state, payload) {

        }
    }, extra)
}
