import camelcase from "camelcase";
import extendTheme from "./extendTheme";
import resolveRoles from "./resolveTheme";

function buildName(colorScheme, density) {
  return [
    colorScheme.metadata.colorSchemeName,
    density.metadata.densityName
  ].join(", ");
}

function buildFileName(colorScheme, density) {
  return camelcase([
    colorScheme.metadata.colorSchemeName,
    density.metadata.densityName,
    "Theme"
  ]);
}

function buildId(colorScheme, density) {
  return [colorScheme.metadata.colorSchemeId, density.metadata.densityId].join(
    "-"
  );
}

function buildDeprecatedRoles(colorScheme, density) {
  const colorSchemeDensityRoles = Object.entries({
    ...colorScheme.unresolvedRoles,
    ...density.unresolvedRoles
  });

  const reducer = (deprecatedRoles, [roleName, roleValue]) => {
    if (roleValue.metadata && roleValue.metadata.deprecated) {
      return Object.assign({}, deprecatedRoles, {
        [roleName]: roleValue.metadata.deprecated
      });
    }

    return deprecatedRoles;
  };

  return colorSchemeDensityRoles.reduce(reducer, {});
}

function buildTheme(colorScheme, density) {
  const unresolvedRoles = extendTheme(
    colorScheme.unresolvedRoles,
    density.unresolvedRoles
  );
  const metadata = { ...colorScheme.metadata, ...density.metadata };
  const resolvedRoles = resolveRoles(unresolvedRoles);

  return {
    metadata: {
      ...metadata,
      name: buildName(colorScheme, density),
      fileName: buildFileName(colorScheme, density),
      id: buildId(colorScheme, density),
      __deprecated__: buildDeprecatedRoles(colorScheme, density)
    },
    unresolvedRoles,
    resolvedRoles
  };
}

export default function generateAllThemes(colorSchemes, densities) {
  const themes = [];

  colorSchemes.forEach(colorScheme => {
    densities.forEach(density => {
      themes.push(buildTheme(colorScheme, density));
    });
  });
  return themes;
}
