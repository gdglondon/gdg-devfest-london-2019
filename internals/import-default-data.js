import { initializeFirebase, firestore } from './firebase-config';
import data from '../docs/default-firebase-data.json';

const importTeam = () => {
  const teams = data.team;
  if (!Object.keys(teams).length) {
    return false;
  }
  console.log('\tImporting', Object.keys(teams).length, 'subteam...');

  const batch = firestore.batch();

  Object.keys(teams).forEach((teamId) => {
    batch.set(
      firestore.collection('team').doc(teamId),
      { title: teams[teamId].title },
    );

    teams[teamId].members.forEach((member, id) => {
      batch.set(
        firestore.collection('team').doc(`${teamId}`).collection('members').doc(`${id}`),
        member,
      );
    })
  });

  return batch.commit()
    .then(results => {
      console.log('\tImported data for', results.length, 'documents');
      return results;
    });
};

const importPartners = () => {
  const partners = data.partners;
  if (!Object.keys(partners).length) {
    return false;
  }
  console.log('\tImporting partners...');

  const batch = firestore.batch();

  Object.keys(partners).forEach((docId) => {
    batch.set(
        firestore.collection('partners').doc(docId),
        { title: partners[docId].title,
          order: partners[docId].order },
    );

    partners[docId].logos.forEach((item, id) => {
      batch.set(
        firestore.collection('partners').doc(`${docId}`).collection('items').doc(`${id}`.padStart(3, 0)),
        item,
      );
    })
  });

  return batch.commit()
    .then(results => {
      console.log('\tImported data for', results.length, 'documents');
      return results;
    });
};

const importGallery = () => {
  const gallery = data.gallery;
  if (!Object.keys(gallery).length) {
    return false;
  }
  console.log('\tImporting gallery...');

  const batch = firestore.batch();

  Object.keys(gallery).forEach((docId) => {
    batch.set(
      firestore.collection('gallery').doc(`${docId}`.padStart(3, 0)),
      {
        url: gallery[docId],
        order: docId,
      },
    );
  });

  return batch.commit()
    .then(results => {
      console.log('\tImported data for', results.length, 'images');
      return results;
    });
};

const importTickets = () => {
  const docs = data.tickets;
  if (!Object.keys(docs).length) {
    return false;
  }
  console.log('\tImporting tickets...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId) => {
    batch.set(
      firestore.collection('tickets').doc(`${docId}`.padStart(3, 0)),
      {
        ...docs[docId],
        order: docId,
      },
    );
  });

  return batch.commit()
    .then(results => {
      console.log('\tImported data for', results.length, 'tickets');
      return results;
    });
};

const importNotificationsConfig = async () => {
  const notificationsConfig = data.notifications.config;
  console.log('Migrating notifications config...');
  const batch = firestore.batch();

  batch.set(
    firestore.collection('config').doc('notifications'),
    notificationsConfig,
  );

  return batch.commit()
    .then(results => {
      console.log('\tImported data for notifications config');
      return results;
    });

};

initializeFirebase()
  .then(() => importGallery())
  .then(() => importNotificationsConfig())
  .then(() => importPartners())
  .then(() => importTeam())
  .then(() => importTickets())

  .then(() => {
    console.log('Finished');
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });
