const subscriptions = {};
// const createNotificationSubscription =  require("./push-notifications");
async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey
  });
}


function handleshotspottereventsListner(req, res) {
  createNotificationSubscription()
  .then(function(subscrition) {
    console.log(subscrition);
  })
  .catch(err => {
    console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
    setError(err);
  });
  Console.log('PayLoadData' + req.body);
  res.status(200);
}



module.exports = { handleshotspottereventsListner };
