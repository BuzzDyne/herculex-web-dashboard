export const ROLE_MAPPING = {
  ADMIN: 'Admin',
  DESIGNER: 'Designer',
  PRINTER: 'Printer',
  PACKER: 'Packer',
};

export const ORDERDETAIL_ACTION_ROLE_ACCESS_MAPPING = {
  1: [ // Mapping for Role ADMIN
    'Input Data',
    'Submit Design Link',
    'Edit Design Link',
    'Approve Design',
    'Printing Done',
    'Packing Done',
  ],
  2: [ // Mapping for Role DESIGNER
    'Submit Design Link',
    'Edit Design Link',
  ],
  3: [ // Mapping for Role PRINTER
    'Printing Done',
  ],
  4: [ // Mapping for Role PACKER
    'Packing Done',
  ],
};