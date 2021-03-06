export default {
    name: 'RLTableHeading',
    props: ['column'],
    provide() {
        return {
            column: () => this.column
        }
    },
    inject: ['opts', 'theme', 'sortableClass', 'getHeadingTooltip', 'getHeading', 'orderByColumn', 'componentsOverride', 'tabIndex'],
    render(h) {
        return this.$scopedSlots.default({
            opts: this.opts(),
            thAttrs: {
                class: `${this.sortableClass(this.column)} ${this.theme.th}`.trim(),
                tabIndex: this.tabIndex(),
                style: this.getStyle(),
                title: this.getHeadingTooltip(this.column)
            },
            thEvents: {
                keypress: function (e) {
                    if (e.key === "Enter") {
                        this.orderByColumn(this.column, e);
                    }
                },
                click: (e) => {
                    if (e.target.className !== "resize-handle") {
                        this.orderByColumn(this.column, e);
                    }
                }
            },
            spanAttrs: {
                title: this.getHeadingTooltip(this.column)
            },
            heading: this.getHeading(this.column, h),
            override: this.componentsOverride.tableHeading
        })
    },
    methods: {
        getStyle() {
            var cls = '';

            if (this.opts().stickyHeader) {
                cls += 'position:sticky; top:0;';
            }

            if (this.opts().stickyHeaderBackground) {
                cls += `background:${this.opts().stickyHeaderBackground};`;
            }

            return cls;
        }
    }
}
