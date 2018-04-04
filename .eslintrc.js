module.exports = {
  'extends': 'airbnb-base',
  'settings': {
    'import/resolver': {
      'jspm': {
        'moduleDirectory': 'jspm_packages'
      }
    }
  },
  'rules': {
    'import/no-extraneous-dependencies': 'off',
    'prefer-rest-params': 'off',
    'max-len': ['error', 80],
    'no-use-before-define': 'off'
  },
  'plugins': [
    'import'
  ]
};
