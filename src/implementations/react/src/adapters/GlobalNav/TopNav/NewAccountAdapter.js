import React from 'react';
import PropTypes from 'prop-types';
import * as HIG from 'hig-vanilla';
import HIGAdapter, {
  MountedByHIGParentList,
  MapsPropToMethod,
  MapsEventListener
} from '../../HIGAdapter';

function AccountAdapter(props) {
  return (
    <HIGAdapter
      {...props}
      name="Account"
      HIGConstructor={HIG.GlobalNav._partials.TopNav._partials.ProjectAccountSwitcher._partials.Account}
    >
      {adapterProps => (
        <div>
          <MountedByHIGParentList mounter="addAccount" {...adapterProps} />
          <MapsEventListener listener="onClick" handler={props.onClick} {...adapterProps} />
          <MapsPropToMethod setter="setImage" value={props.image} {...adapterProps} />
          <MapsPropToMethod setter="setLabel" value={props.label} {...adapterProps} />
          <MapsPropToMethod value={props.active} {...adapterProps}>
            {(instance, value) => { value ? instance.activate() : instance.deactivate() }}
          </MapsPropToMethod>
        </div>
      )}
    </HIGAdapter>
  );
}

AccountAdapter.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func
};

export default AccountAdapter;
