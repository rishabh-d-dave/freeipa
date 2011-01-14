/*jsl:import ipa.js */

/*  Authors:
 *    Pavel Zuna <pzuna@redhat.com>
 *
 * Copyright (C) 2010 Red Hat
 * see file 'COPYING' for use and warranty information
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* REQUIRES: ipa.js, details.js, search.js, add.js, entity.js */

IPA.group = function () {

    var that = IPA.entity({
        'name': 'group'
    });

    that.init = function() {

        that.create_association({
            name: 'netgroup',
            associator: 'serial'
        });

        that.create_association({
            name: 'rolegroup',
            associator: 'serial'
        });

        that.create_association({
            name: 'taskgroup',
            associator: 'serial'
        });

        var dialog = IPA.group_add_dialog({
            'name': 'add',
            'title': 'Add New Group'
        });
        that.add_dialog(dialog);
        dialog.init();

        var facet = IPA.group_search_facet({
            'name': 'search',
            'label': 'Search'
        });
        that.add_facet(facet);

        facet = IPA.group_details_facet({
            'name': 'details'
        });
        that.add_facet(facet);

        that.create_association_facets();

        that.entity_init();
    };

    return that;
};


IPA.add_entity(IPA.group());


IPA.group_add_dialog = function (spec) {

    spec = spec || {};

    var that = IPA.add_dialog(spec);

    that.init = function() {

        that.add_field(IPA.text_widget({name:'cn', undo: false}));
        that.add_field(IPA.text_widget({name:'description', undo: false}));
        // TODO: Replace with i18n label
        that.add_field(IPA.checkbox_widget({
            name:'posix',
            label:'Is this a POSIX group?',
            undo: false,
            checked:'checked'}));
        that.add_field(IPA.text_widget({name:'gidnumber', undo: false}));

        that.add_dialog_init();
    };

    return that;
};


IPA.group_search_facet = function (spec) {

    spec = spec || {};

    var that = IPA.search_facet(spec);

    that.init = function() {
        that.create_column({name:'cn'});
        that.create_column({name:'gidnumber'});
        that.create_column({name:'description'});
        that.search_facet_init();
    };

    return that;
};


IPA.group_details_facet = function (spec) {

    spec = spec || {};

    var that = IPA.details_facet(spec);

    that.init = function() {

        var section = IPA.details_list_section({
            name: 'details',
            label: 'Group Settings'
        });
        that.add_section(section);

        section.create_field({name: 'cn' });
        section.create_field({name: 'description'});
        section.create_field({name: 'gidnumber' });

        that.details_facet_init();
    };

    return that;
};


IPA.group_member_user_facet = function (spec) {

    spec = spec || {};

    var that = IPA.association_facet(spec);

    that.init = function() {

        that.create_column({name: 'cn'});

        var column = that.create_column({
            name: 'uid',
            primary_key: true
        });

        column.setup = function(container, record) {
            container.empty();

            var value = record[column.name];
            value = value ? value.toString() : '';

            $('<a/>', {
                'href': '#'+value,
                'html': value,
                'click': function (value) {
                    return function() {
                        var state = IPA.tab_state(that.other_entity);
                        state[that.other_entity + '-facet'] = 'details';
                        state[that.other_entity + '-pkey'] = value;
                        $.bbq.pushState(state);
                        return false;
                    };
                }(value)
            }).appendTo(container);
        };

        that.create_column({name: 'uidnumber'});
        that.create_column({name: 'mail'});
        that.create_column({name: 'telephonenumber'});
        that.create_column({name: 'title'});

        that.create_adder_column({
            name: 'cn',
            width: '100px'
        });

        that.create_adder_column({
            name: 'uid',
            primary_key: true,
            width: '100px'
        });

        that.association_facet_init();
    };

    return that;
};
