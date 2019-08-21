#include <QDir>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonValue>
#include <QtGlobal>
#include <QCoreApplication>

namespace QodeHelpers {
    void setStartFile(QJsonDocument conf);
    QJsonDocument readConfig();
}