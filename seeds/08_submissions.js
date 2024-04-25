exports.seed = function(knex) {
    return knex('submissions').del()
      .then(function () {
        return knex('submissions').insert([
          {
            user_id: 1,
            sub_event_id: 1,
            work_title: 'My Awesome Artwork',
            description: 'This is a description of my awesome artwork.',
            archive: 'https://www.faeterj-rio.edu.br/downloads/bbv/0031.pdf',
            submission_date: new Date('2023-04-15 10:30:00'),
            status: 'Pending'
          },
          {
            user_id: 2,
            sub_event_id: 2,
            work_title: 'My Amazing Story',
            description: 'This is a description of my amazing short story.',
            archive: 'http://antigo.scl.ifsp.edu.br/portal/arquivos/2016.05.04_Apostila_Python_-_PET_ADS_S%C3%A3o_Carlos.pdf',
            submission_date: new Date('2023-04-20 15:45:00'),
            status: 'Approved'
          },
          {
            user_id: 2,
            sub_event_id: 1,
            work_title: 'Untitled Photograph',
            description: 'This is a description of my untitled photograph.',
            archive: 'https://people.cs.aau.dk/~torp/Teaching/E03/OOP/handouts/introduction.pdf',
            submission_date: new Date('2023-04-22 08:15:00'),
            status: 'Pending'
          }
        ]);
      });
  };